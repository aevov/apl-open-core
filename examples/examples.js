/**
 * APL Example Programs
 * Demonstrating both ASCII and Runic syntax
 */

const examples = {
    // ============================================
    // HELLO WORLD
    // ============================================
    helloWorld: {
        ascii: `
// Simple Hello World
print("Hello from APL!")
`,
        runic: `
// ᛊimple Hello World  
print("Hello from APL!")
`
    },

    // ============================================
    // QUANTUM COMPUTATION
    // ============================================
    quantumSuperposition: {
        ascii: `
// Create quantum superposition
function quantum_demo() {
    q = Q.super(2)
    Q.gate(q, "hadamard", 0)
    Q.entangle(q, 0, 1)
    return q
}
`,
        runic: `
// Create quantum superposition
function quantum_demo() {
    q = ᛩ(2)
    ᛜ(q, "hadamard", 0)
    ᙠ(q, 0, 1)
    return q
}
`
    },

    // ============================================
    // NEURAL LEARNING
    // ============================================
    neuralLearning: {
        ascii: `
// Neural pattern matching and learning
function learn_pattern(data) {
    net = N.net(100)
    for sample in data {
        match = N.match(net, sample)
        N.learn(net, match, 0.01)
    }
    return net
}
`,
        runic: `
// Neural pattern matching and learning
function learn_pattern(data) {
    net = ᚾ(100)
    for sample in data {
        match = ᛈ(net, sample)
        ᚻ(net, match, 0.01)
    }
    return net
}
`
    },

    // ============================================
    // GENETIC ALGORITHM
    // ============================================
    geneticEvolution: {
        ascii: `
// Genetic algorithm optimization
function evolve_solution(population, generations) {
    for i in 0..generations {
        fitness = G.fitness(population)
        selected = D.dist(fitness)
        offspring = G.cross(selected)
        G.mutate(offspring, 0.1)
        population = D.unify(selected, offspring)
    }
    return population
}
`,
        runic: `
// Genetic algorithm optimization  
function evolve_solution(population, generations) {
    for i in 0..generations {
        fitness = ᚠ(population)
        selected = ᛞ(fitness)
        offspring = ᚴ(selected)
        ᚥ(offspring, 0.1)
        population = ᚢ(selected, offspring)
    }
    return population
}
`
    },

    // ============================================
    // NEUROSYMBOLIC REASONING
    // ============================================
    neurosymbolicReasoning: {
        ascii: `
// Combine neural and symbolic reasoning
function reason_about(knowledge, query) {
    graph = S.graph(knowledge)
    patterns = N.match(query)
    inference = S.reason(graph, patterns)
    result = D.unify(patterns, inference)
    return result
}
`,
        runic: `
// Combine neural and symbolic reasoning
function reason_about(knowledge, query) {
    graph = ᛕ(knowledge)
    patterns = ᛈ(query)
    inference = ᛊ(graph, patterns)
    result = ᚢ(patterns, inference)
    return result
}
`
    },

    // ============================================
    // CONSCIOUSNESS INTEGRATION
    // ============================================
    consciousnessCalc: {
        ascii: `
// Calculate integrated information (Φ)
function measure_consciousness(system) {
    info = C.integrate(system)
    phi = C.phi(info)
    return phi
}
`,
        runic: `
// Calculate integrated information (Φ)
function measure_consciousness(system) {
    info = ᛇ(system)
    phi = ᚳ(info)
    return phi
}
`
    },

    // ============================================
    // RESONANCE SYNCHRONIZATION
    // ============================================
    resonanceSync: {
        ascii: `
// Synchronize oscillators through resonance
function sync_oscillators(nodes) {
    for node in nodes {
        osc = R.osc(node.frequency)
        R.sync(osc, nodes)
    }
    return nodes
}
`,
        runic: `
// Synchronize oscillators through resonance
function sync_oscillators(nodes) {
    for node in nodes {
        osc = ᛟ(node.frequency)
        ᚱ(osc, nodes)
    }
    return nodes
}
`
    },

    // ============================================
    // COMPLETE AI SYSTEM
    // ============================================
    completeAI: {
        ascii: `
// Full neurosymbolic AI system
function ai_system(input) {
    // Quantum preprocessing
    q = Q.super(input.size)
    Q.gate(q, "hadamard")
    
    // Neural processing
    net = N.net(1000)
    patterns = N.match(net, q)
    N.learn(net, patterns, 0.01)
    
    // Symbolic reasoning
    knowledge = S.graph(patterns)
    inference = S.reason(knowledge)
    
    // Genetic optimization
    solutions = G.fitness(inference)
    best = evolve_solution(solutions, 100)
    
    // Unify results
    result = D.unify(patterns, best)
    
    // Measure consciousness
    phi = C.phi(result)
    
    return D.bind(result, phi)
}
`,
        runic: `
// Full neurosymbolic AI system
function ai_system(input) {
    // Quantum preprocessing
    q = ᛩ(input.size)
    ᛜ(q, "hadamard")
    
    // Neural processing
    net = ᚾ(1000)
    patterns = ᛈ(net, q)
    ᚻ(net, patterns, 0.01)
    
    // Symbolic reasoning
    knowledge = ᛕ(patterns)
    inference = ᛊ(knowledge)
    
    // Genetic optimization
    solutions = ᚠ(inference)
    best = evolve_solution(solutions, 100)
    
    // Unify results
    result = ᚢ(patterns, best)
    
    // Measure consciousness
    phi = ᚳ(result)
    
    return ᛂ(result, phi)
}
`
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = examples;
} else if (typeof window !== 'undefined') {
    window.APLExamples = examples;
}
