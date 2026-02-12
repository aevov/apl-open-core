/**
 * APL Runtime Engine
 * Executes APL bytecode in the browser or Node.js
 * Version: 1.0.0
 */

class APLRuntime {
    constructor() {
        this.memory = new Map();
        this.stack = [];
        this.callStack = [];
        this.functions = new Map();
        this.globals = new Map();
        this.quantumState = null;
        this.neuralState = null;
        this.pc = 0; // Program counter
        this.running = false;
    }
    
    /**
     * Execute compiled bytecode
     */
    async execute(bytecode) {
        this.pc = 0;
        this.running = true;
        
        try {
            while (this.pc < bytecode.length && this.running) {
                const instruction = bytecode[this.pc];
                await this.executeInstruction(instruction);
                this.pc++;
            }
            
            return {
                success: true,
                result: this.stack.length > 0 ? this.stack[this.stack.length - 1] : null
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                pc: this.pc
            };
        }
    }
    
    /**
     * Execute single instruction
     */
    async executeInstruction(instruction) {
        const { opcode } = instruction;
        
        switch (opcode) {
            // Memory Operations
            case 0b0000: // MEM_LOAD
                return this.opMemLoad(instruction);
            case 0b0001: // MEM_STORE
                return this.opMemStore(instruction);
            case 0b0010: // MEM_ALLOC
                return this.opMemAlloc(instruction);
            case 0b0011: // MEM_FREE
                return this.opMemFree(instruction);
            
            // Pattern Operations
            case 0b0100: // PATTERN_MATCH
                return this.opPatternMatch(instruction);
            case 0b0101: // PATTERN_BIND
                return this.opPatternBind(instruction);
            
            // Neural Operations
            case 0b1000: // NEURAL_SPIKE
                return this.opNeuralSpike(instruction);
            case 0b1001: // NEURAL_LEARN
                return this.opNeuralLearn(instruction);
            
            // Quantum Operations
            case 0b01100: // QUANTUM_INIT
                return this.opQuantumInit(instruction);
            case 0b01101: // QUANTUM_GATE
                return this.opQuantumGate(instruction);
            case 0b01110: // QUANTUM_MEASURE
                return this.opQuantumMeasure(instruction);
            case 0b01111: // QUANTUM_ENTANGLE
                return this.opQuantumEntangle(instruction);
            
            // Control Flow
            case 0b10000: // JUMP
                return this.opJump(instruction);
            case 0b10001: // JUMP_IF
                return this.opJumpIf(instruction);
            case 0b10010: // CALL
                return this.opCall(instruction);
            case 0b10011: // RETURN
                return this.opReturn(instruction);
            case 0b10100: // LOOP
                return this.opLoop(instruction);
            case 0b10101: // PARALLEL
                return this.opParallel(instruction);
            
            // Arithmetic
            case 0b11000: // ADD
                return this.opAdd();
            case 0b11001: // SUB
                return this.opSub();
            case 0b11010: // MUL
                return this.opMul();
            case 0b11011: // DIV
                return this.opDiv();
            
            // Special opcodes (non-binary)
            case 'FUNC_DECL':
                return this.opFuncDecl(instruction);
            case 'PUSH_CONST':
                return this.stack.push(instruction.value);
            case 'LOOP_END':
                return; // No-op, handled by loop logic
            
            default:
                throw new Error(`Unknown opcode: ${opcode}`);
        }
    }
    
    // ============================================
    // MEMORY OPERATIONS
    // ============================================
    
    opMemLoad(instruction) {
        const value = this.memory.get(instruction.source) || this.globals.get(instruction.source);
        if (value === undefined) {
            throw new Error(`Undefined variable: ${instruction.source}`);
        }
        this.stack.push(value);
    }
    
    opMemStore(instruction) {
        const value = this.stack.pop();
        this.memory.set(instruction.target, value);
    }
    
    opMemAlloc(instruction) {
        const size = this.stack.pop();
        const buffer = new ArrayBuffer(size);
        this.stack.push(buffer);
    }
    
    opMemFree(instruction) {
        const addr = this.stack.pop();
        // In JavaScript, GC handles this
        // Just remove from memory map
        this.memory.delete(addr);
    }
    
    // ============================================
    // PATTERN OPERATIONS
    // ============================================
    
    opPatternMatch(instruction) {
        const value = this.stack.pop();
        const pattern = instruction.pattern;
        
        // Simple pattern matching
        const matches = this.matchPattern(value, pattern);
        this.stack.push(matches);
    }
    
    matchPattern(value, pattern) {
        if (typeof pattern === 'object' && pattern !== null) {
            if (Array.isArray(pattern)) {
                return Array.isArray(value) && pattern.every((p, i) => this.matchPattern(value[i], p));
            }
            return Object.keys(pattern).every(key => this.matchPattern(value[key], pattern[key]));
        }
        return value === pattern;
    }
    
    opPatternBind(instruction) {
        const value = this.stack.pop();
        instruction.bindings.forEach(binding => {
            this.memory.set(binding, value);
        });
    }
    
    // ============================================
    // QUANTUM OPERATIONS
    // ============================================
    
    opQuantumInit(instruction) {
        // Initialize quantum state
        const numQubits = instruction.args[0]?.value || 1;
        
        this.quantumState = {
            numQubits,
            amplitudes: this.initQuantumAmplitudes(numQubits),
            entangled: []
        };
        
        this.stack.push(this.quantumState);
    }
    
    initQuantumAmplitudes(numQubits) {
        const size = Math.pow(2, numQubits);
        const amplitudes = new Array(size).fill(0).map(() => ({ real: 0, imag: 0 }));
        amplitudes[0] = { real: 1, imag: 0 }; // |0...0âŸ© state
        return amplitudes;
    }
    
    opQuantumGate(instruction) {
        if (!this.quantumState) {
            throw new Error('Quantum state not initialized');
        }
        
        const gate = instruction.gate;
        const target = instruction.target;
        
        switch (gate) {
            case 'HADAMARD':
                this.applyHadamard(target);
                break;
            case 'CNOT':
                this.applyCNOT(target, instruction.control);
                break;
            case 'PHASE':
                this.applyPhase(target, instruction.angle);
                break;
            default:
                throw new Error(`Unknown quantum gate: ${gate}`);
        }
    }
    
    applyHadamard(target) {
        const { amplitudes, numQubits } = this.quantumState;
        const size = amplitudes.length;
        const newAmplitudes = [...amplitudes];
        
        for (let i = 0; i < size; i++) {
            if ((i & (1 << target)) === 0) {
                const j = i | (1 << target);
                const { real: r0, imag: i0 } = amplitudes[i];
                const { real: r1, imag: i1 } = amplitudes[j];
                
                newAmplitudes[i] = {
                    real: (r0 + r1) / Math.sqrt(2),
                    imag: (i0 + i1) / Math.sqrt(2)
                };
                newAmplitudes[j] = {
                    real: (r0 - r1) / Math.sqrt(2),
                    imag: (i0 - i1) / Math.sqrt(2)
                };
            }
        }
        
        this.quantumState.amplitudes = newAmplitudes;
    }
    
    applyCNOT(target, control) {
        const { amplitudes } = this.quantumState;
        const size = amplitudes.length;
        const newAmplitudes = [...amplitudes];
        
        for (let i = 0; i < size; i++) {
            if ((i & (1 << control)) !== 0) {
                const j = i ^ (1 << target);
                [newAmplitudes[i], newAmplitudes[j]] = [newAmplitudes[j], newAmplitudes[i]];
            }
        }
        
        this.quantumState.amplitudes = newAmplitudes;
    }
    
    applyPhase(target, angle) {
        const { amplitudes } = this.quantumState;
        const phase = { real: Math.cos(angle), imag: Math.sin(angle) };
        
        for (let i = 0; i < amplitudes.length; i++) {
            if ((i & (1 << target)) !== 0) {
                const { real, imag } = amplitudes[i];
                amplitudes[i] = {
                    real: real * phase.real - imag * phase.imag,
                    imag: real * phase.imag + imag * phase.real
                };
            }
        }
    }
    
    opQuantumMeasure(instruction) {
        if (!this.quantumState) {
            throw new Error('Quantum state not initialized');
        }
        
        const { amplitudes } = this.quantumState;
        
        // Calculate probabilities
        const probabilities = amplitudes.map(a => a.real * a.real + a.imag * a.imag);
        
        // Sample from distribution
        const random = Math.random();
        let cumulative = 0;
        let result = 0;
        
        for (let i = 0; i < probabilities.length; i++) {
            cumulative += probabilities[i];
            if (random < cumulative) {
                result = i;
                break;
            }
        }
        
        // Collapse state
        this.quantumState.amplitudes = this.quantumState.amplitudes.map((_, i) => 
            i === result ? { real: 1, imag: 0 } : { real: 0, imag: 0 }
        );
        
        this.stack.push(result);
    }
    
    opQuantumEntangle(instruction) {
        const qubit1 = instruction.qubit1;
        const qubit2 = instruction.qubit2;
        
        this.quantumState.entangled.push([qubit1, qubit2]);
    }
    
    // ============================================
    // NEURAL OPERATIONS
    // ============================================
    
    opNeuralSpike(instruction) {
        if (!this.neuralState) {
            this.neuralState = {
                neurons: new Map(),
                synapses: new Map(),
                spikes: []
            };
        }
        
        const neuronId = instruction.neuronId;
        const timestamp = Date.now();
        
        this.neuralState.spikes.push({ neuronId, timestamp });
    }
    
    opNeuralLearn(instruction) {
        if (!this.neuralState) {
            throw new Error('Neural state not initialized');
        }
        
        // STDP learning rule
        const reward = instruction.reward || 1.0;
        const learningRate = instruction.learningRate || 0.01;
        
        // Update synaptic weights based on spike timing
        this.neuralState.synapses.forEach((synapse, id) => {
            const timeDiff = synapse.postSpike - synapse.preSpike;
            const deltaWeight = learningRate * reward * Math.exp(-Math.abs(timeDiff) / 20);
            synapse.weight += deltaWeight;
        });
    }
    
    // ============================================
    // CONTROL FLOW OPERATIONS
    // ============================================
    
    opJump(instruction) {
        this.pc = instruction.target - 1; // -1 because pc++ happens after
    }
    
    opJumpIf(instruction) {
        const condition = this.stack.pop();
        if (condition) {
            this.pc = instruction.target - 1;
        }
    }
    
    opCall(instruction) {
        this.callStack.push({
            pc: this.pc,
            memory: new Map(this.memory)
        });
        
        // Look up function
        const func = this.functions.get(instruction.function);
        if (!func) {
            throw new Error(`Undefined function: ${instruction.function}`);
        }
        
        // Set up arguments
        const args = [];
        for (let i = 0; i < instruction.argCount; i++) {
            args.unshift(this.stack.pop());
        }
        
        func.params.forEach((param, i) => {
            this.memory.set(param.name, args[i]);
        });
        
        // Jump to function
        this.pc = func.address - 1;
    }
    
    opReturn(instruction) {
        if (this.callStack.length === 0) {
            this.running = false;
            return;
        }
        
        const frame = this.callStack.pop();
        this.pc = frame.pc;
        
        // Restore memory (keep return value on stack)
        const returnValue = this.stack[this.stack.length - 1];
        this.memory = frame.memory;
        if (returnValue !== undefined) {
            this.stack.push(returnValue);
        }
    }
    
    async opLoop(instruction) {
        const iterable = this.evalExpression(instruction.iterable);
        const variable = instruction.variable;
        
        // Mark loop start
        const loopStart = this.pc;
        
        for (const item of iterable) {
            this.memory.set(variable, item);
            
            // Execute loop body
            let depth = 1;
            let bodyPc = this.pc + 1;
            while (depth > 0 && bodyPc < this.bytecode.length) {
                if (this.bytecode[bodyPc].opcode === 'LOOP') depth++;
                if (this.bytecode[bodyPc].opcode === 'LOOP_END') depth--;
                
                if (depth > 0) {
                    await this.executeInstruction(this.bytecode[bodyPc]);
                }
                bodyPc++;
            }
        }
        
        // Skip to after LOOP_END
        let depth = 1;
        while (depth > 0 && this.pc < this.bytecode.length) {
            this.pc++;
            if (this.bytecode[this.pc].opcode === 'LOOP') depth++;
            if (this.bytecode[this.pc].opcode === 'LOOP_END') depth--;
        }
    }
    
    async opParallel(instruction) {
        const iterable = this.evalExpression(instruction.iterable);
        const variable = instruction.variable;
        
        // Execute in parallel using Web Workers or Promise.all
        const promises = [];
        
        for (const item of iterable) {
            promises.push(this.executeParallelTask(variable, item, instruction));
        }
        
        await Promise.all(promises);
        
        // Skip to after LOOP_END
        let depth = 1;
        while (depth > 0 && this.pc < this.bytecode.length) {
            this.pc++;
            if (this.bytecode[this.pc].opcode === 'PARALLEL') depth++;
            if (this.bytecode[this.pc].opcode === 'LOOP_END') depth--;
        }
    }
    
    async executeParallelTask(variable, value, instruction) {
        // Create isolated context for parallel execution
        const isolatedMemory = new Map(this.memory);
        isolatedMemory.set(variable, value);
        
        // Execute body in isolation
        // (In production, this would use Web Workers)
        const savedMemory = this.memory;
        this.memory = isolatedMemory;
        
        // Execute loop body
        let depth = 1;
        let bodyPc = this.pc + 1;
        while (depth > 0 && bodyPc < this.bytecode.length) {
            if (this.bytecode[bodyPc].opcode === 'PARALLEL') depth++;
            if (this.bytecode[bodyPc].opcode === 'LOOP_END') depth--;
            
            if (depth > 0) {
                await this.executeInstruction(this.bytecode[bodyPc]);
            }
            bodyPc++;
        }
        
        this.memory = savedMemory;
    }
    
    // ============================================
    // ARITHMETIC OPERATIONS
    // ============================================
    
    opAdd() {
        const b = this.stack.pop();
        const a = this.stack.pop();
        this.stack.push(a + b);
    }
    
    opSub() {
        const b = this.stack.pop();
        const a = this.stack.pop();
        this.stack.push(a - b);
    }
    
    opMul() {
        const b = this.stack.pop();
        const a = this.stack.pop();
        this.stack.push(a * b);
    }
    
    opDiv() {
        const b = this.stack.pop();
        const a = this.stack.pop();
        if (b === 0) throw new Error('Division by zero');
        this.stack.push(a / b);
    }
    
    // ============================================
    // HELPER METHODS
    // ============================================
    
    opFuncDecl(instruction) {
        this.functions.set(instruction.name, {
            params: instruction.params,
            address: this.pc + 1,
            isAsync: instruction.isAsync
        });
        
        // Skip function body
        let depth = 1;
        while (depth > 0 && this.pc < this.bytecode.length) {
            this.pc++;
            if (this.bytecode[this.pc].opcode === 'FUNC_DECL') depth++;
            if (this.bytecode[this.pc].opcode === 0b10011) depth--; // RETURN
        }
    }
    
    evalExpression(expr) {
        // Evaluate expression node to value
        if (expr.type === 'Identifier') {
            return this.memory.get(expr.value) || this.globals.get(expr.value);
        }
        if (expr.type === 'Literal') {
            return expr.value;
        }
        if (expr.type === 'CallExpression') {
            // Range expression (e.g., 0..10)
            if (expr.callee.value === '..') {
                const start = this.evalExpression(expr.arguments[0]);
                const end = this.evalExpression(expr.arguments[1]);
                return Array.from({ length: end - start }, (_, i) => start + i);
            }
        }
        return [];
    }
    
    /**
     * Register native functions
     */
    registerNative(name, func) {
        this.globals.set(name, func);
    }
    
    /**
     * Get current state
     */
    getState() {
        return {
            memory: Object.fromEntries(this.memory),
            stack: [...this.stack],
            quantumState: this.quantumState,
            neuralState: this.neuralState,
            pc: this.pc
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APLRuntime;
} else if (typeof window !== 'undefined') {
    window.APLRuntime = APLRuntime;
}
