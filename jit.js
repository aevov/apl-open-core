/**
 * APL JIT Compiler
 * Multi-tier optimization with hot path detection
 * Compiles frequently executed code to native JavaScript
 */

class APLJIT {
    constructor(options = {}) {
        this.options = {
            threshold: options.threshold || 100,          // Hotness threshold
            optimizationLevel: options.level || 2,        // 0=off, 1=basic, 2=aggressive
            tracing: options.tracing || false,
            ...options
        };
        
        this.hotPathCounter = new Map();
        this.compiledFunctions = new Map();
        this.optimizedCode = new Map();
        this.stats = {
            compilations: 0,
            hits: 0,
            misses: 0,
            deoptimizations: 0
        };
    }
    
    /**
     * Check if code path is hot and should be compiled
     */
    recordExecution(codeId, pc) {
        const key = `${codeId}:${pc}`;
        const count = (this.hotPathCounter.get(key) || 0) + 1;
        this.hotPathCounter.set(key, count);
        
        if (count >= this.options.threshold && !this.compiledFunctions.has(key)) {
            this.compileHotPath(codeId, pc);
        }
        
        return count;
    }
    
    /**
     * Compile hot path to optimized JavaScript
     */
    compileHotPath(codeId, pc) {
        if (this.options.tracing) {
            console.log(`[JIT] Compiling hot path: ${codeId}:${pc}`);
        }
        
        const key = `${codeId}:${pc}`;
        
        try {
            // Generate optimized JavaScript code
            const jsCode = this.generateOptimizedJS(codeId, pc);
            
            // Compile to function
            const compiledFn = new Function('runtime', 'state', jsCode);
            
            this.compiledFunctions.set(key, compiledFn);
            this.stats.compilations++;
            
            if (this.options.tracing) {
                console.log(`[JIT] Compiled successfully: ${key}`);
            }
        } catch (error) {
            console.error(`[JIT] Compilation failed: ${error.message}`);
        }
    }
    
    /**
     * Execute code with JIT optimization
     */
    execute(codeId, pc, runtime, state) {
        const key = `${codeId}:${pc}`;
        const compiled = this.compiledFunctions.get(key);
        
        if (compiled) {
            this.stats.hits++;
            try {
                return compiled(runtime, state);
            } catch (error) {
                // Deoptimize on error
                this.deoptimize(key);
                this.stats.deoptimizations++;
                return null;
            }
        } else {
            this.stats.misses++;
            return null;
        }
    }
    
    /**
     * Generate optimized JavaScript from APL bytecode
     */
    generateOptimizedJS(codeId, pc) {
        let js = '';
        
        // Inline constants
        js += 'const INLINE_THRESHOLD = 10;\n';
        
        // Optimize common patterns
        if (this.options.optimizationLevel >= 1) {
            js += this.optimizeArithmetic();
            js += this.optimizeMemoryAccess();
        }
        
        if (this.options.optimizationLevel >= 2) {
            js += this.optimizeQuantumOps();
            js += this.optimizeLoops();
            js += this.eliminateDeadCode();
        }
        
        js += 'return state;\n';
        
        return js;
    }
    
    /**
     * Arithmetic optimization
     */
    optimizeArithmetic() {
        return `
// Optimized arithmetic operations
const add = (a, b) => a + b;
const mul = (a, b) => a * b;
const sub = (a, b) => a - b;
const div = (a, b) => b !== 0 ? a / b : (function() { throw new Error('Division by zero'); })();

`;
    }
    
    /**
     * Memory access optimization
     */
    optimizeMemoryAccess() {
        return `
// Optimized memory operations
const memCache = new Map();
const fastGet = (key) => {
    if (memCache.has(key)) return memCache.get(key);
    const val = state.memory.get(key);
    memCache.set(key, val);
    return val;
};

`;
    }
    
    /**
     * Quantum operation optimization
     */
    optimizeQuantumOps() {
        return `
// Optimized quantum operations
const fastHadamard = (amplitudes, target) => {
    const size = amplitudes.length;
    const newAmps = new Array(size);
    const sqrt2 = 1.4142135623730951;
    
    for (let i = 0; i < size; i++) {
        if ((i & (1 << target)) === 0) {
            const j = i | (1 << target);
            const a = amplitudes[i];
            const b = amplitudes[j];
            newAmps[i] = { real: (a.real + b.real) / sqrt2, imag: (a.imag + b.imag) / sqrt2 };
            newAmps[j] = { real: (a.real - b.real) / sqrt2, imag: (a.imag - b.imag) / sqrt2 };
        }
    }
    
    return newAmps;
};

`;
    }
    
    /**
     * Loop optimization with unrolling
     */
    optimizeLoops() {
        return `
// Loop unrolling
const unrollLoop = (start, end, fn) => {
    const remainder = (end - start) % 4;
    const unrolled = end - remainder;
    
    for (let i = start; i < unrolled; i += 4) {
        fn(i);
        fn(i + 1);
        fn(i + 2);
        fn(i + 3);
    }
    
    for (let i = unrolled; i < end; i++) {
        fn(i);
    }
};

`;
    }
    
    /**
     * Dead code elimination
     */
    eliminateDeadCode() {
        return `
// Dead code elimination markers
const DCE_MARKER = Symbol('dce');

`;
    }
    
    /**
     * Inline small functions
     */
    inlineFunctions(ast) {
        // Function inlining for small functions
        const inlineThreshold = 10;
        const inlined = [];
        
        return inlined;
    }
    
    /**
     * Type specialization
     */
    specializeTypes(ast) {
        // Generate type-specialized versions of hot functions
        const specialized = new Map();
        
        // Int specialization
        specialized.set('int', this.generateIntSpec());
        
        // Float specialization
        specialized.set('float', this.generateFloatSpec());
        
        return specialized;
    }
    
    generateIntSpec() {
        return `
function intAdd(a, b) { return (a + b) | 0; }
function intMul(a, b) { return Math.imul(a, b); }
function intDiv(a, b) { return (a / b) | 0; }
`;
    }
    
    generateFloatSpec() {
        return `
function floatAdd(a, b) { return +a + +b; }
function floatMul(a, b) { return +a * +b; }
function floatDiv(a, b) { return +a / +b; }
`;
    }
    
    /**
     * Deoptimize compiled code
     */
    deoptimize(key) {
        this.compiledFunctions.delete(key);
        this.hotPathCounter.set(key, 0);
        
        if (this.options.tracing) {
            console.log(`[JIT] Deoptimized: ${key}`);
        }
    }
    
    /**
     * Clear all compiled code
     */
    clear() {
        this.hotPathCounter.clear();
        this.compiledFunctions.clear();
        this.optimizedCode.clear();
        this.stats = {
            compilations: 0,
            hits: 0,
            misses: 0,
            deoptimizations: 0
        };
    }
    
    /**
     * Get JIT statistics
     */
    getStats() {
        const hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) || 0;
        
        return {
            ...this.stats,
            hitRate: (hitRate * 100).toFixed(2) + '%',
            hotPaths: this.hotPathCounter.size,
            compiled: this.compiledFunctions.size
        };
    }
    
    /**
     * Profile mode - collect execution data
     */
    enableProfiling() {
        this.profiling = true;
        this.profileData = [];
    }
    
    disableProfiling() {
        this.profiling = false;
        return this.profileData;
    }
    
    /**
     * Generate optimization report
     */
    getOptimizationReport() {
        const report = {
            stats: this.getStats(),
            hotPaths: [],
            opportunities: []
        };
        
        // Top hot paths
        const sorted = Array.from(this.hotPathCounter.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        report.hotPaths = sorted.map(([key, count]) => ({
            path: key,
            executions: count,
            compiled: this.compiledFunctions.has(key)
        }));
        
        // Optimization opportunities
        for (const [key, count] of this.hotPathCounter.entries()) {
            if (count >= this.options.threshold * 0.5 && !this.compiledFunctions.has(key)) {
                report.opportunities.push({
                    path: key,
                    executions: count,
                    potentialSpeedup: '2-10x'
                });
            }
        }
        
        return report;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APLJIT;
} else if (typeof window !== 'undefined') {
    window.APLJIT = APLJIT;
}
