/**
 * APL Runic-ASCII Mapping System
 * Supports both ASCII and native runic compilation to same bytecode
 * Version: 1.0.0
 */

const RunicMap = {
    // ASCII to Runic mappings
    asciiToRunic: {
        // Quantum Operations
        'Q.super': 'ᛩ',
        'Q.gate': 'ᛜ',
        'Q.entangle': 'ᙠ',
        'Q.teleport': 'ᛪ',
        
        // Genetic Operations
        'G.cross': 'ᚴ',
        'G.fitness': 'ᚠ',
        'G.mutate': 'ᚥ',
        
        // Neural Operations
        'N.net': 'ᚾ',
        'N.match': 'ᛈ',
        'N.synapse': 'ᛒ',
        'N.learn': 'ᚻ',
        
        // Consciousness Operations
        'C.phi': 'ᚳ',
        'C.integrate': 'ᛇ',
        
        // Symbolic Operations
        'S.reason': 'ᛊ',
        'S.graph': 'ᛕ',
        
        // Resonance Operations
        'R.osc': 'ᛟ',
        'R.sync': 'ᚱ',
        
        // Memory Operations
        'M.access': 'ᛗ',
        
        // Coordination Operations
        'D.dist': 'ᛞ',
        'D.unify': 'ᚢ',
        'D.bind': 'ᛂ',
        
        // Control Flow
        'C.rate': 'ᚤ',
        'C.yield': 'ᛘ',
        'C.init': 'ᛎ',
        
        // Data Types
        'T.quantum': 'QReg',
        'T.spike': 'Spike',
        'T.neuron': 'Neuron',
        'T.synapse': 'Synapse',
        'T.int': 'Int',
        'T.float': 'Float',
        'T.bool': 'Bool',
        'T.array': 'Array',
        'T.map': 'Map',
        'T.qstate': 'QState',
        'T.epr': 'EPR'
    },
    
    // Reverse mapping
    runicToAscii: {},
    
    // Initialize reverse mapping
    init() {
        for (const [ascii, runic] of Object.entries(this.asciiToRunic)) {
            this.runicToAscii[runic] = ascii;
        }
        return this;
    },
    
    // Convert ASCII code to runic
    toRunic(code) {
        let result = code;
        
        // Sort by length (longest first) to handle multi-char patterns
        const sortedKeys = Object.keys(this.asciiToRunic)
            .sort((a, b) => b.length - a.length);
        
        for (const ascii of sortedKeys) {
            const runic = this.asciiToRunic[ascii];
            result = result.split(ascii).join(runic);
        }
        
        return result;
    },
    
    // Convert runic code to ASCII
    toAscii(code) {
        let result = code;
        
        for (const [runic, ascii] of Object.entries(this.runicToAscii)) {
            result = result.split(runic).join(ascii);
        }
        
        return result;
    },
    
    // Normalize code (ensures consistent internal representation)
    normalize(code) {
        // Detect if code is predominantly ASCII or runic
        const hasRunic = /[\u16A0-\u16FF\u1400-\u167F]/.test(code);
        
        if (hasRunic) {
            // Code has runic characters, keep as is
            return { normalized: code, mode: 'runic' };
        } else {
            // ASCII code, optionally convert to runic for internal processing
            return { normalized: code, mode: 'ascii' };
        }
    },
    
    // Get operation info
    getOpInfo(char) {
        const ascii = this.runicToAscii[char] || char;
        return {
            char,
            ascii,
            isRunic: this.runicToAscii.hasOwnProperty(char),
            isAscii: this.asciiToRunic.hasOwnProperty(char)
        };
    },
    
    // Validate character encoding
    isValidRunic(char) {
        return /[\u16A0-\u16FF\u1400-\u167F]/.test(char);
    },
    
    // Pretty print with mode indication
    format(code, options = {}) {
        const { mode = 'auto', indent = 2 } = options;
        
        if (mode === 'ascii') {
            return this.toAscii(code);
        } else if (mode === 'runic') {
            return this.toRunic(code);
        }
        
        return code;
    }
}.init();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RunicMap;
} else if (typeof window !== 'undefined') {
    window.RunicMap = RunicMap;
}
