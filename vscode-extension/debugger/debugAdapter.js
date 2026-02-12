const {
    DebugSession,
    InitializedEvent, TerminatedEvent, StoppedEvent, BreakpointEvent, OutputEvent,
    Thread, StackFrame, Scope, Variable, Breakpoint
} = require('vscode-debugadapter');
const { Subject } = require('await-notify');
const path = require('path');
const fs = require('fs');

let APL;
try {
    APL = require('@aevov/apl');
} catch (e) {
    APL = require('../../src/index.js');
}

class APLDebugSession extends DebugSession {
    constructor() {
        super();
        
        this._runtime = null;
        this._configurationDone = new Subject();
        this._breakPoints = new Map();
        this._variableHandles = 0;
        this._variableMap = new Map();
    }
    
    initializeRequest(response, args) {
        response.body = response.body || {};
        
        // Capabilities
        response.body.supportsConfigurationDoneRequest = true;
        response.body.supportsEvaluateForHovers = true;
        response.body.supportsStepBack = false;
        response.body.supportsDataBreakpoints = false;
        response.body.supportsCompletionsRequest = true;
        response.body.supportsBreakpointLocationsRequest = true;
        response.body.supportsSetVariable = true;
        response.body.supportsConditionalBreakpoints = true;
        
        this.sendResponse(response);
        this.sendEvent(new InitializedEvent());
    }
    
    async configurationDoneRequest(response, args) {
        await this._configurationDone.wait(1000);
        this.sendResponse(response);
    }
    
    async launchRequest(response, args) {
        this.sendEvent(new OutputEvent('APL Debugger starting...\n'));
        
        const program = args.program;
        if (!fs.existsSync(program)) {
            this.sendErrorResponse(response, {
                id: 1,
                format: `Program not found: ${program}`
            });
            return;
        }
        
        const code = fs.readFileSync(program, 'utf-8');
        
        try {
            this.sendEvent(new OutputEvent(`Loading: ${program}\n`));
            
            const apl = new APL({ debug: true });
            this._runtime = apl.runtime;
            
            // Compile
            const compiled = apl.compile(code);
            if (!compiled.success) {
                this.sendErrorResponse(response, {
                    id: 2,
                    format: `Compilation error: ${compiled.error}`
                });
                return;
            }
            
            this.sendEvent(new OutputEvent(`Compiled successfully (${compiled.code?.operations?.length || 0} ops)\n`));
            
            // Store compiled code
            this._compiled = compiled;
            this._apl = apl;
            
            if (args.stopOnEntry) {
                this.sendResponse(response);
                this.sendEvent(new StoppedEvent('entry', 1));
            } else {
                this.continueRequest(response, { threadId: 1 });
            }
            
        } catch (error) {
            this.sendErrorResponse(response, {
                id: 3,
                format: `Launch error: ${error.message}`
            });
        }
    }
    
    async setBreakPointsRequest(response, args) {
        const path = args.source.path;
        const breakpoints = args.breakpoints || [];
        
        // Store breakpoints
        this._breakPoints.set(path, breakpoints.map(bp => bp.line));
        
        // Convert to actual breakpoints
        const actualBreakpoints = breakpoints.map(bp => {
            return new Breakpoint(true, bp.line);
        });
        
        response.body = {
            breakpoints: actualBreakpoints
        };
        
        this.sendResponse(response);
    }
    
    threadsRequest(response) {
        response.body = {
            threads: [
                new Thread(1, 'Main Thread')
            ]
        };
        this.sendResponse(response);
    }
    
    stackTraceRequest(response, args) {
        const frames = [];
        
        if (this._runtime) {
            const state = this._runtime.getState();
            
            // Main frame
            frames.push(new StackFrame(
                0,
                'main',
                undefined,
                state.pc
            ));
            
            // Call stack frames
            if (state.callStack) {
                state.callStack.forEach((frame, i) => {
                    frames.push(new StackFrame(
                        i + 1,
                        `frame_${i}`,
                        undefined,
                        frame.pc
                    ));
                });
            }
        }
        
        response.body = {
            stackFrames: frames,
            totalFrames: frames.length
        };
        
        this.sendResponse(response);
    }
    
    scopesRequest(response, args) {
        response.body = {
            scopes: [
                new Scope('Local', this.createVariableHandle('local'), false),
                new Scope('Global', this.createVariableHandle('global'), true),
                new Scope('Stack', this.createVariableHandle('stack'), false)
            ]
        };
        this.sendResponse(response);
    }
    
    async variablesRequest(response, args) {
        const variables = [];
        const handle = args.variablesReference;
        const scope = this._variableMap.get(handle);
        
        if (this._runtime) {
            const state = this._runtime.getState();
            
            if (scope === 'local' || scope === 'global') {
                const memory = scope === 'local' ? state.memory : {};
                
                for (const [key, value] of Object.entries(memory)) {
                    variables.push(new Variable(
                        key,
                        this.formatValue(value),
                        this.createVariableHandle(value)
                    ));
                }
            } else if (scope === 'stack') {
                state.stack.forEach((item, i) => {
                    variables.push(new Variable(
                        `[${i}]`,
                        this.formatValue(item),
                        0
                    ));
                });
            }
        }
        
        response.body = {
            variables
        };
        
        this.sendResponse(response);
    }
    
    async continueRequest(response, args) {
        if (this._compiled && this._apl) {
            try {
                const result = await this._apl.execute(this._compiled);
                
                if (result.success) {
                    this.sendEvent(new OutputEvent(`\nExecution completed\n`));
                    this.sendEvent(new OutputEvent(`Result: ${JSON.stringify(result.result, null, 2)}\n`));
                } else {
                    this.sendEvent(new OutputEvent(`\nExecution failed: ${result.error}\n`, 'stderr'));
                }
                
                this.sendEvent(new TerminatedEvent());
            } catch (error) {
                this.sendEvent(new OutputEvent(`Runtime error: ${error.message}\n`, 'stderr'));
                this.sendEvent(new TerminatedEvent());
            }
        }
        
        this.sendResponse(response);
    }
    
    nextRequest(response, args) {
        // Step over
        this.sendResponse(response);
        this.sendEvent(new StoppedEvent('step', 1));
    }
    
    stepInRequest(response, args) {
        // Step into
        this.sendResponse(response);
        this.sendEvent(new StoppedEvent('step', 1));
    }
    
    stepOutRequest(response, args) {
        // Step out
        this.sendResponse(response);
        this.sendEvent(new StoppedEvent('step', 1));
    }
    
    async evaluateRequest(response, args) {
        let result = '';
        
        if (args.context === 'repl' || args.context === 'watch') {
            try {
                const apl = new APL();
                const evalResult = await apl.run(args.expression);
                result = JSON.stringify(evalResult.result, null, 2);
            } catch (error) {
                result = error.message;
            }
        }
        
        response.body = {
            result,
            variablesReference: 0
        };
        
        this.sendResponse(response);
    }
    
    // Helper methods
    createVariableHandle(value) {
        if (typeof value === 'string') {
            this._variableHandles++;
            this._variableMap.set(this._variableHandles, value);
            return this._variableHandles;
        }
        return 0;
    }
    
    formatValue(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }
}

// Start debug adapter
if (require.main === module) {
    DebugSession.run(APLDebugSession);
}

module.exports = APLDebugSession;
