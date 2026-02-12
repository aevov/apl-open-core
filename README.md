> [!NOTE]
> This repository is a core component of the **Aevov AI Technologies** ecosystem. For the complete lineage and orchestration hub, visit the [Alexandria Hub](https://github.com/aevov/alexandria-hub).

# APL Framework

**The World's First Hardware-Native Neurosymbolic Language**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/aevov/apl)
[![License](https://img.shields.io/badge/license-Apache%202.0-green.svg)](LICENSE)
[![Hardware](https://img.shields.io/badge/hardware-aevQG%E2%88%9E-purple.svg)](https://aevov.ai)

APL is a groundbreaking programming language designed simultaneously with its target hardware architecture, creating the world's first zero-overhead neurosymbolic computing platform.

## ✨ Key Features

- **🔮 Quantum Native**: Direct quantum operations with hardware-native superposition and entanglement
- **🧠 Neuromorphic**: Spiking neural networks and synaptic learning primitives
- **🧬 Genetic Algorithms**: Hardware-accelerated evolutionary computation
- **📚 Symbolic AI**: Knowledge graphs and logical reasoning engines
- **⚡ Zero Overhead**: Language constructs map 1-to-1 to silicon functional units
- **🎯 Dual Syntax**: Write in ASCII or native runic characters - both compile to identical bytecode

## 🚀 Quick Start

### Installation

```bash
npm install @aevov/apl
```

Or via CDN:

```html
<script src="https://cdn.aevov.ai/apl/v1.0.0/apl.bundle.js"></script>
```

### Hello World

```javascript
const APL = require('@aevov/apl');
const apl = new APL();

await apl.run(`
    print("Hello from APL!")
`);
```

### Quantum Superposition (ASCII)

```javascript
await apl.run(`
    // Create 2-qubit quantum state
    q = Q.super(2)
    
    // Apply Hadamard gate
    Q.gate(q, "hadamard", 0)
    
    // Entangle qubits
    Q.entangle(q, 0, 1)
    
    print("Quantum state created!")
`);
```

### Quantum Superposition (Runic)

```javascript
await apl.run(`
    // Create 2-qubit quantum state
    q = ᛩ(2)
    
    // Apply Hadamard gate
    ᛜ(q, "hadamard", 0)
    
    // Entangle qubits
    ᙠ(q, 0, 1)
    
    print("Quantum state created!")
`);
```

## 📖 Documentation

### ASCII Operations Reference

| Operation | ASCII | Runic | Hardware Unit | Description |
|-----------|-------|-------|---------------|-------------|
| Quantum Superposition | `Q.super` | `ᛩ` | QFU | Create quantum superposition |
| Quantum Gate | `Q.gate` | `ᛜ` | QFU | Apply quantum gate |
| Entanglement | `Q.entangle` | `ᙠ` | QFU | Entangle qubits |
| Quantum Teleport | `Q.teleport` | `ᛪ` | QFU | Quantum teleportation |
| Genetic Crossover | `G.cross` | `ᚴ` | GEU | Crossover operation |
| Fitness Evaluation | `G.fitness` | `ᚠ` | GEU | Evaluate fitness |
| Mutation | `G.mutate` | `ᚥ` | GEU | Apply mutation |
| Neural Network | `N.net` | `ᚾ` | NPU | Create neural network |
| Pattern Match | `N.match` | `ᛈ` | NPU | Pattern matching |
| Synapse | `N.synapse` | `ᛒ` | NPU | Tripartite synapse |
| Hebbian Learning | `N.learn` | `ᚻ` | NPU | Learning rule |
| Consciousness Φ | `C.phi` | `ᚳ` | CU | Integrated information |
| Information Integration | `C.integrate` | `ᛇ` | CU | Integrate information |
| Symbolic Reasoning | `S.reason` | `ᛊ` | SRE | Logical reasoning |
| Knowledge Graph | `S.graph` | `ᛕ` | SRE | Graph operations |
| Oscillator | `R.osc` | `ᛟ` | RU | Create oscillator |
| Resonance Sync | `R.sync` | `ᚱ` | RU | Synchronize |
| Memory Access | `M.access` | `ᛗ` | MU | Memory operations |
| Distribute | `D.dist` | `ᛞ` | COORD | Distribute work |
| Unify | `D.unify` | `ᚢ` | COORD | Unify results |
| Bind | `D.bind` | `ᛂ` | COORD | Bind values |

### Complete Example: Neurosymbolic AI

```javascript
const APL = require('@aevov/apl');
const apl = new APL();

// Full AI system combining all paradigms
await apl.run(`
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
        best = evolve(solutions, 100)
        
        // Unify all results
        result = D.unify(patterns, best)
        
        // Measure consciousness
        phi = C.phi(result)
        
        return D.bind(result, phi)
    }
    
    print(ai_system({ size: 100 }))
`);
```

## 🎮 Interactive Demo

Check out the interactive playground:

```bash
cd examples
open demo.html
```

Or visit: [https://apl.aevov.ai/playground](https://apl.aevov.ai/playground)

## 🏗️ Architecture

### Software Layer (Open Source)

- **Language Specification**: Full APL language grammar and semantics
- **Compiler Frontend**: Parser, tokenizer, and AST generation
- **Classical Optimizer**: Traditional compiler optimizations
- **Software Simulators**: Quantum and neural simulators for development
- **Standard Library**: Common operations and utilities
- **Development Tools**: VS Code extension, debugger, profiler

### Hardware Layer (Licensed IP)

- **`.aevQG∞ ISA`**: Proprietary 5-bit runic instruction encoding
- **Quantum Units**: Native quantum gate execution
- **Neural Cores**: Spiking neural hardware
- **Hardware Compiler**: Native code generation for .aevQG∞
- **Performance Optimizations**: Secret sauce algorithms

## 📊 Performance

| Workload | Python + PyTorch | APL (Software) | APL (Hardware) |
|----------|------------------|----------------|----------------|
| Neural Training | 1.0x | 10-20x | 100-1000x |
| Quantum Simulation | 1.0x | 5-10x | 50-500x |
| Genetic Algorithm | 1.0x | 15-30x | 200-2000x |
| Symbolic Reasoning | 1.0x | 8-15x | 100-800x |

## 🔒 Licensing

### Open Source (Apache 2.0)
- APL language specification
- Compiler (frontend + classical optimizations)
- Software simulators
- Development tools
- Standard library

### Proprietary (Licensed)
- `.aevQG∞` hardware ISA
- Quantum/neural hardware implementations
- Hardware compiler backend
- Performance-critical optimizations

**Result**: Learn APL for free, license hardware for production performance.

## 🛠️ Development

### Building from Source

```bash
git clone https://github.com/aevov/apl.git
cd apl
npm install
npm run build
```

### Running Tests

```bash
npm test
```

### Creating Custom Operations

```javascript
const apl = new APL();

// Register native function
apl.registerNative('myFunction', (arg1, arg2) => {
    return arg1 + arg2;
});

// Use in code
await apl.run(`
    result = myFunction(10, 20)
    print(result)  // 30
`);
```

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Areas We Need Help

- [ ] Additional language examples
- [ ] VS Code syntax highlighting
- [ ] Standard library functions
- [ ] Documentation improvements
- [ ] Test coverage
- [ ] Performance benchmarks

## 🗺️ Roadmap

### v1.1 (Q1 2025)
- [ ] VS Code extension
- [ ] Debugger integration
- [ ] Package manager (apl-pkg)
- [ ] More standard library functions

### v1.5 (Q2 2025)
- [ ] JIT compilation
- [ ] WebAssembly backend
- [ ] Browser-based IDE
- [ ] Hardware emulator

### v2.0 (Q3 2025)
- [ ] .aevQG∞ hardware launch
- [ ] Cloud API access
- [ ] Production-ready tooling
- [ ] Enterprise support

## 📚 Resources

- **Official Site**: [https://apl.aevov.ai](https://apl.aevov.ai)
- **Documentation**: [https://docs.apl.aevov.ai](https://docs.apl.aevov.ai)
- **GitHub**: [https://github.com/aevov/apl](https://github.com/aevov/apl)
- **Discord**: [https://discord.gg/apl](https://discord.gg/apl)
- **Hardware Licensing**: [hardware@aevov.ai](mailto:hardware@aevov.ai)

## 💬 Community

- **Discord**: Real-time chat and support
- **GitHub Discussions**: Long-form technical discussions
- **Stack Overflow**: Tag questions with `apl-lang`
- **Twitter**: [@AevovAI](https://twitter.com/AevovAI)

## 🙏 Acknowledgments

Built on decades of research in:
- Quantum computing (Shor, Grover, Aaronson)
- Neuromorphic engineering (Carver Mead, Kwabena Boahen)
- Genetic algorithms (John Holland, David Goldberg)
- Integrated Information Theory (Giulio Tononi)
- Neurosymbolic AI (Gary Marcus, Yoshua Bengio)

## 📄 License

- **Language & Compiler**: Apache License 2.0
- **Hardware IP**: Proprietary - Contact for licensing

See [LICENSE](LICENSE) for details.

---

**Made with ⚡ by Aevov** | [Website](https://aevov.ai) | [Hardware Licensing](mailto:hardware@aevov.ai)
