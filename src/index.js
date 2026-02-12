/**
 * APL (Aevov Programming Language)
 * The World's First Hardware-Native Neurosymbolic Language
 * 
 * Version: 1.0.0
 * License: Apache 2.0 (Language & Compiler) / Proprietary (Hardware IP)
 */

const APLRuntime = require('./apl-runtime');
const APLCompiler = require('./apl-compiler');
const RunicMap = require('./runic-map');

class APL {
    constructor(options = {}) {
        this.options = {
            mode: options.mode || 'auto', // 'ascii', 'runic', or 'auto'
            hardwareAcceleration: options.hardwareAcceleration || false,
            debug: options.debug || false,
            ...options
        };
        
        this.runtime = new APLRuntime();
        this.compiler = typeof APLCompiler === 'function' 
            ? new APLCompiler() 
            : APLCompiler;
        this.runicMap = RunicMap;
        
        // Native function registry
        this.nativeFunctions = new Map();
        
        // Initialize standard library
        this.initStdLib();
    }
    
    /**
     * Compile APL source code to bytecode
     * Supports both ASCII and runic syntax
     */
    compile(source, options = {}) {
        const mode = options.mode || this.options.mode;
        
        // Normalize source code
        const normalized = this.runicMap.normalize(source);
        
        if (this.options.debug) {
            console.log('[APL] Compiling in mode:', normalized.mode);
        }
        
        // Compile using the compiler
        const result = typeof this.compiler.compile === 'function'
            ? this.compiler.compile(normalized.normalized)
            : this.fallbackCompile(normalized.normalized);
        
        if (result.success && this.options.debug) {
            console.log('[APL] Compilation successful');
            console.log('[APL] Operations:', result.code?.operations?.length || 0);
        }
        
        return {
            ...result,
            sourceMode: normalized.mode
        };
    }
    
    /**
     * Execute compiled bytecode
     */
    async execute(bytecode) {
        if (!bytecode || !bytecode.success) {
            throw new Error('Invalid bytecode: ' + (bytecode?.error || 'Unknown error'));
        }
        
        return await this.runtime.execute(bytecode.code?.executionPlan || []);
    }
    
    /**
     * Compile and run source code in one step
     */
    async run(source, options = {}) {
        const compiled = this.compile(source, options);
        
        if (!compiled.success) {
            return {
                success: false,
                error: compiled.error,
                stage: 'compilation'
            };
        }
        
        try {
            const result = await this.execute(compiled);
            return {
                success: true,
                result: result.result,
                compiled
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                stage: 'execution',
                compiled
            };
        }
    }
    
    /**
     * Register native function
     */
    registerNative(name, func) {
        this.nativeFunctions.set(name, func);
        this.runtime.registerNative(name, func);
    }
    
    /**
     * Initialize standard library
     */
    initStdLib() {
        // Math functions
        this.registerNative('sqrt', Math.sqrt);
        this.registerNative('pow', Math.pow);
        this.registerNative('sin', Math.sin);
        this.registerNative('cos', Math.cos);
        
        // Array functions
        this.registerNative('map', (arr, fn) => arr.map(fn));
        this.registerNative('filter', (arr, fn) => arr.filter(fn));
        this.registerNative('reduce', (arr, fn, init) => arr.reduce(fn, init));
        
        // I/O functions
        this.registerNative('print', console.log);
        this.registerNative('log', console.log);
        
        // Time functions
        this.registerNative('now', () => Date.now());
        this.registerNative('sleep', (ms) => new Promise(resolve => setTimeout(resolve, ms)));
    }
    
    /**
     * Fallback compiler for simple expressions
     */
    fallbackCompile(source) {
        // Simple tokenization and bytecode generation
        const tokens = source.trim().split(/\s+/);
        const executionPlan = [];
        
        tokens.forEach(token => {
            if (!isNaN(token)) {
                executionPlan.push({
                    type: 'number',
                    value: parseFloat(token)
                });
            } else if (token in this.nativeFunctions) {
                executionPlan.push({
                    type: 'function',
                    name: token
                });
            }
        });
        
        return {
            success: true,
            code: { executionPlan, operations: [], hardwareMap: {} }
        };
    }
    
    /**
     * Get runtime state
     */
    getState() {
        return this.runtime.getState();
    }
    
    /**
     * Reset runtime
     */
    reset() {
        this.runtime = new APLRuntime();
        this.initStdLib();
    }
    
    /**
     * Convert between ASCII and runic
     */
    toRunic(code) {
        return this.runicMap.toRunic(code);
    }
    
    toAscii(code) {
        return this.runicMap.toAscii(code);
    }
    
    /**
     * Get version
     */
    static get version() {
        return '1.0.0';
    }
    
    /**
     * Quick start helper
     */
    static quickStart(source) {
        const apl = new APL();
        return apl.run(source);
    }
}

// Export
module.exports = APL;
module.exports.APL = APL;
module.exports.APLRuntime = APLRuntime;
module.exports.APLCompiler = APLCompiler;
module.exports.RunicMap = RunicMap;
