# Getting Started with APL

Welcome to APL - the world's first hardware-native neurosymbolic programming language! This guide will get you up and running in minutes.

## Installation

### Option 1: NPM (Recommended for Node.js)

```bash
npm install @aevov/apl
```

### Option 2: CDN (For Browser)

Add this to your HTML:

```html
<script src="https://cdn.aevov.ai/apl/v1.0.0/apl.bundle.js"></script>
```

### Option 3: Download

Download the bundle from [GitHub Releases](https://github.com/aevov/apl/releases)

## Your First APL Program

### In Node.js

Create a file `hello.js`:

```javascript
const APL = require('@aevov/apl');

async function main() {
    const apl = new APL();
    
    const result = await apl.run(`
        print("Hello from APL!")
    `);
    
    console.log('Success:', result.success);
}

main();
```

Run it:

```bash
node hello.js
```

### In Browser

Create `hello.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>APL Hello World</title>
    <script src="apl.bundle.js"></script>
</head>
<body>
    <h1>APL Demo</h1>
    <button onclick="runCode()">Run Code</button>
    <pre id="output"></pre>
    
    <script>
        async function runCode() {
            const apl = new APL();
            const result = await apl.run(`
                print("Hello from APL!")
            `);
            
            document.getElementById('output').textContent = 
                JSON.stringify(result, null, 2);
        }
    </script>
</body>
</html>
```

## Understanding APL Basics

### 1. Dual Syntax

APL supports both ASCII and runic characters:

**ASCII Version:**
```javascript
q = Q.super(2)
Q.gate(q, "hadamard")
```

**Runic Version:**
```javascript
q = ᛩ(2)
ᛜ(q, "hadamard")
```

Both compile to **identical bytecode**!

### 2. Hardware Operations

APL operations map directly to hardware units:

```javascript
// Quantum operations → QFU (Quantum Functional Unit)
q = Q.super(4)

// Neural operations → NPU (Neural Processing Unit)  
net = N.net(100)

// Genetic operations → GEU (Genetic Evolution Unit)
pop = G.fitness(solutions)
```

### 3. Variables and Functions

Standard programming constructs work as expected:

```javascript
// Variables
x = 10
y = 20
z = x + y

// Functions
function add(a, b) {
    return a + b
}

result = add(5, 3)
```

## Example Programs

### 1. Quantum Superposition

```javascript
const apl = new APL();

await apl.run(`
    function create_bell_state() {
        // Create 2-qubit system
        q = Q.super(2)
        
        // Hadamard on qubit 0
        Q.gate(q, "hadamard", 0)
        
        // CNOT to entangle
        Q.entangle(q, 0, 1)
        
        return q
    }
    
    bell = create_bell_state()
    print("Bell state created!")
`);
```

### 2. Neural Pattern Learning

```javascript
await apl.run(`
    function learn_patterns(data) {
        // Create neural network
        net = N.net(100)
        
        // Train on each pattern
        for pattern in data {
            match = N.match(net, pattern)
            N.learn(net, match, 0.01)
        }
        
        return net
    }
    
    trained = learn_patterns([1, 2, 3, 4, 5])
    print("Network trained!")
`);
```

### 3. Genetic Algorithm

```javascript
await apl.run(`
    function evolve(pop, gens) {
        for i in 0..gens {
            fit = G.fitness(pop)
            best = D.dist(fit)
            kids = G.cross(best)
            G.mutate(kids, 0.1)
            pop = D.unify(best, kids)
        }
        return pop
    }
    
    solution = evolve([1,2,3,4,5], 100)
    print("Evolution complete!")
`);
```

### 4. Neurosymbolic AI

Combining multiple paradigms:

```javascript
await apl.run(`
    function ai_system(input) {
        // Step 1: Quantum preprocessing
        q = Q.super(input.size)
        Q.gate(q, "hadamard")
        
        // Step 2: Neural processing
        net = N.net(1000)
        patterns = N.match(net, q)
        
        // Step 3: Symbolic reasoning
        graph = S.graph(patterns)
        inference = S.reason(graph)
        
        // Step 4: Unify results
        result = D.unify(patterns, inference)
        
        return result
    }
    
    output = ai_system({ size: 100 })
    print("AI processing complete!")
`);
```

## API Reference

### Core APL Class

```javascript
const apl = new APL(options)
```

Options:
- `mode`: 'ascii', 'runic', or 'auto' (default: 'auto')
- `debug`: Enable debug logging (default: false)
- `hardwareAcceleration`: Enable .aevQG∞ hardware (default: false, requires license)

### Methods

#### `compile(source, options)`

Compile APL source code to bytecode.

```javascript
const compiled = apl.compile(`
    q = Q.super(2)
`);

console.log(compiled.success); // true
console.log(compiled.code);    // bytecode
```

#### `execute(bytecode)`

Execute compiled bytecode.

```javascript
const result = await apl.execute(compiled);
```

#### `run(source, options)`

Compile and execute in one step.

```javascript
const result = await apl.run(`
    print("Hello!")
`);
```

#### `registerNative(name, function)`

Register a native JavaScript function.

```javascript
apl.registerNative('myFunc', (x, y) => {
    return x * y;
});

await apl.run(`
    result = myFunc(5, 3)
    print(result)  // 15
`);
```

#### `toRunic(code)` / `toAscii(code)`

Convert between ASCII and runic.

```javascript
const runic = apl.toRunic('Q.super(2)');
console.log(runic); // 'ᛩ(2)'

const ascii = apl.toAscii('ᛩ(2)');
console.log(ascii); // 'Q.super(2)'
```

## Operation Reference Quick Guide

| Category | ASCII | Runic | Description |
|----------|-------|-------|-------------|
| **Quantum** |
| Superposition | Q.super | ᛩ | Create quantum state |
| Gate | Q.gate | ᛜ | Apply quantum gate |
| Entangle | Q.entangle | ᙠ | Entangle qubits |
| **Neural** |
| Network | N.net | ᚾ | Create neural net |
| Match | N.match | ᛈ | Pattern match |
| Learn | N.learn | ᚻ | Learning rule |
| **Genetic** |
| Fitness | G.fitness | ᚠ | Evaluate fitness |
| Crossover | G.cross | ᚴ | Crossover operation |
| Mutate | G.mutate | ᚥ | Apply mutation |
| **Symbolic** |
| Graph | S.graph | ᛕ | Knowledge graph |
| Reason | S.reason | ᛊ | Logical reasoning |
| **Coordination** |
| Distribute | D.dist | ᛞ | Distribute work |
| Unify | D.unify | ᚢ | Unify results |
| Bind | D.bind | ᛂ | Bind values |

## Next Steps

1. **Explore Examples**: Check the `examples/` directory
2. **Read Documentation**: Visit [docs.apl.aevov.ai](https://docs.apl.aevov.ai)
3. **Join Discord**: Get help at [discord.gg/apl](https://discord.gg/apl)
4. **Try Hardware**: License .aevQG∞ for production performance

## Hardware Acceleration

APL runs on any standard hardware (x86, ARM, RISC-V) using software simulation. For production workloads requiring 100-1000x speedup, license the .aevQG∞ hardware:

```javascript
const apl = new APL({
    hardwareAcceleration: true,
    licenseKey: 'your-license-key'
});
```

Contact [hardware@aevov.ai](mailto:hardware@aevov.ai) for licensing.

## Troubleshooting

### "Module not found"

Make sure you've installed APL:
```bash
npm install @aevov/apl
```

### "Runic characters not displaying"

Ensure your editor/terminal supports UTF-8 encoding.

### "Hardware operations not working"

Hardware operations are simulated in software by default. For actual hardware acceleration, a .aevQG∞ license is required.

### Need More Help?

- Check [FAQ](https://apl.aevov.ai/faq)
- Ask on [Discord](https://discord.gg/apl)
- Open [GitHub Issue](https://github.com/aevov/apl/issues)

---

**Happy Coding! ⚡**
