const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

let APL;
try {
    APL = require('@aevov/apl');
} catch (e) {
    // Fallback to relative path during development
    APL = require('../src/index.js');
}

let outputChannel;
let diagnosticCollection;

function activate(context) {
    console.log('APL extension is now active');
    
    // Create output channel
    outputChannel = vscode.window.createOutputChannel('APL');
    diagnosticCollection = vscode.languages.createDiagnosticCollection('apl');
    
    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('apl.run', runAPLProgram),
        vscode.commands.registerCommand('apl.compile', compileAPLProgram),
        vscode.commands.registerCommand('apl.convertToRunic', convertToRunic),
        vscode.commands.registerCommand('apl.convertToAscii', convertToAscii),
        vscode.commands.registerCommand('apl.showBytecode', showBytecode),
        vscode.commands.registerCommand('apl.installPackage', installPackage)
    );
    
    // Register completion provider
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider('apl', new APLCompletionProvider(), '.')
    );
    
    // Register hover provider
    context.subscriptions.push(
        vscode.languages.registerHoverProvider('apl', new APLHoverProvider())
    );
    
    // Register definition provider
    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider('apl', new APLDefinitionProvider())
    );
    
    // Register document symbol provider
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider('apl', new APLSymbolProvider())
    );
    
    // Register formatting provider
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider('apl', new APLFormattingProvider())
    );
    
    // Watch for document changes and update diagnostics
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document.languageId === 'apl') {
                updateDiagnostics(event.document);
            }
        })
    );
    
    // Update diagnostics on open
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(document => {
            if (document.languageId === 'apl') {
                updateDiagnostics(document);
            }
        })
    );
    
    outputChannel.appendLine('APL Language Support activated');
}

// Command Implementations
async function runAPLProgram() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active APL file');
        return;
    }
    
    const document = editor.document;
    if (document.languageId !== 'apl') {
        vscode.window.showErrorMessage('Not an APL file');
        return;
    }
    
    outputChannel.clear();
    outputChannel.show();
    outputChannel.appendLine('=== Running APL Program ===');
    outputChannel.appendLine('File: ' + document.fileName);
    outputChannel.appendLine('');
    
    const config = vscode.workspace.getConfiguration('apl');
    const apl = new APL({
        mode: config.get('syntaxMode'),
        debug: config.get('debugLevel') === 'debug',
        hardwareAcceleration: config.get('hardwareAcceleration')
    });
    
    // Capture console output
    const originalLog = console.log;
    console.log = (...args) => {
        outputChannel.appendLine(args.join(' '));
        originalLog(...args);
    };
    
    try {
        const startTime = Date.now();
        const result = await apl.run(document.getText());
        const endTime = Date.now();
        
        outputChannel.appendLine('');
        outputChannel.appendLine(`=== Execution completed in ${endTime - startTime}ms ===`);
        
        if (result.success) {
            outputChannel.appendLine('Status: SUCCESS');
            outputChannel.appendLine('Result: ' + JSON.stringify(result.result, null, 2));
        } else {
            outputChannel.appendLine('Status: FAILED');
            outputChannel.appendLine('Error: ' + result.error);
            outputChannel.appendLine('Stage: ' + result.stage);
        }
    } catch (error) {
        outputChannel.appendLine('');
        outputChannel.appendLine('=== Runtime Error ===');
        outputChannel.appendLine(error.message);
        outputChannel.appendLine(error.stack);
    } finally {
        console.log = originalLog;
    }
}

async function compileAPLProgram() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    
    const document = editor.document;
    outputChannel.clear();
    outputChannel.show();
    outputChannel.appendLine('=== Compiling APL Program ===');
    
    const apl = new APL();
    const result = apl.compile(document.getText());
    
    if (result.success) {
        outputChannel.appendLine('Compilation: SUCCESS');
        outputChannel.appendLine('Mode: ' + result.sourceMode);
        outputChannel.appendLine('Operations: ' + (result.code?.operations?.length || 0));
        outputChannel.appendLine('');
        outputChannel.appendLine('Bytecode:');
        outputChannel.appendLine(JSON.stringify(result.code, null, 2));
        
        vscode.window.showInformationMessage(`Compiled successfully: ${result.code?.operations?.length || 0} operations`);
    } else {
        outputChannel.appendLine('Compilation: FAILED');
        outputChannel.appendLine('Error: ' + result.error);
        
        vscode.window.showErrorMessage('Compilation failed: ' + result.error);
    }
}

async function convertToRunic() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    
    const document = editor.document;
    const apl = new APL();
    const runic = apl.toRunic(document.getText());
    
    await editor.edit(editBuilder => {
        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(document.getText().length)
        );
        editBuilder.replace(fullRange, runic);
    });
    
    vscode.window.showInformationMessage('Converted to runic syntax');
}

async function convertToAscii() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    
    const document = editor.document;
    const apl = new APL();
    const ascii = apl.toAscii(document.getText());
    
    await editor.edit(editBuilder => {
        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(document.getText().length)
        );
        editBuilder.replace(fullRange, ascii);
    });
    
    vscode.window.showInformationMessage('Converted to ASCII syntax');
}

async function showBytecode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    
    const apl = new APL();
    const result = apl.compile(editor.document.getText());
    
    if (result.success) {
        const panel = vscode.window.createWebviewPanel(
            'aplBytecode',
            'APL Bytecode',
            vscode.ViewColumn.Beside,
            {}
        );
        
        panel.webview.html = getBytecodeHTML(result);
    }
}

async function installPackage() {
    const packageName = await vscode.window.showInputBox({
        prompt: 'Enter package name',
        placeHolder: 'package-name'
    });
    
    if (packageName) {
        outputChannel.show();
        outputChannel.appendLine(`Installing package: ${packageName}`);
        vscode.window.showInformationMessage(`Package manager coming soon!`);
    }
}

// Completion Provider
class APLCompletionProvider {
    provideCompletionItems(document, position) {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        
        const items = [];
        
        // Quantum operations
        if (linePrefix.endsWith('Q.')) {
            items.push(
                this.createCompletion('super', 'Create quantum superposition', 'Q.super(qubits)'),
                this.createCompletion('gate', 'Apply quantum gate', 'Q.gate(state, "hadamard", qubit)'),
                this.createCompletion('entangle', 'Entangle qubits', 'Q.entangle(state, q1, q2)'),
                this.createCompletion('teleport', 'Quantum teleportation', 'Q.teleport(state, from, to)')
            );
        }
        
        // Neural operations
        if (linePrefix.endsWith('N.')) {
            items.push(
                this.createCompletion('net', 'Create neural network', 'N.net(size)'),
                this.createCompletion('match', 'Pattern matching', 'N.match(net, pattern)'),
                this.createCompletion('learn', 'Apply learning', 'N.learn(net, pattern, rate)'),
                this.createCompletion('synapse', 'Synaptic processing', 'N.synapse(net)')
            );
        }
        
        // Genetic operations
        if (linePrefix.endsWith('G.')) {
            items.push(
                this.createCompletion('fitness', 'Evaluate fitness', 'G.fitness(population)'),
                this.createCompletion('cross', 'Crossover operation', 'G.cross(parents)'),
                this.createCompletion('mutate', 'Apply mutation', 'G.mutate(population, rate)')
            );
        }
        
        // Symbolic operations
        if (linePrefix.endsWith('S.')) {
            items.push(
                this.createCompletion('graph', 'Create knowledge graph', 'S.graph(data)'),
                this.createCompletion('reason', 'Logical reasoning', 'S.reason(graph, query)')
            );
        }
        
        // Coordination operations
        if (linePrefix.endsWith('D.')) {
            items.push(
                this.createCompletion('dist', 'Distribute work', 'D.dist(data)'),
                this.createCompletion('unify', 'Unify results', 'D.unify(a, b)'),
                this.createCompletion('bind', 'Bind values', 'D.bind(a, b)')
            );
        }
        
        // Keywords
        items.push(
            this.createKeyword('function', 'Function declaration', 'function name(params) {\n\t$0\n}'),
            this.createKeyword('for', 'For loop', 'for item in collection {\n\t$0\n}'),
            this.createKeyword('if', 'If statement', 'if condition {\n\t$0\n}'),
            this.createKeyword('return', 'Return statement', 'return $0')
        );
        
        return items;
    }
    
    createCompletion(label, detail, insertText) {
        const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Function);
        item.detail = detail;
        item.insertText = new vscode.SnippetString(insertText);
        item.documentation = new vscode.MarkdownString(`**${label}** - ${detail}`);
        return item;
    }
    
    createKeyword(label, detail, insertText) {
        const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Keyword);
        item.detail = detail;
        item.insertText = new vscode.SnippetString(insertText);
        return item;
    }
}

// Hover Provider
class APLHoverProvider {
    provideHover(document, position) {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
        
        const docs = {
            'Q.super': 'Create quantum superposition state\n\nSyntax: `Q.super(numQubits)`\nReturns: Quantum state',
            'Q.gate': 'Apply quantum gate operation\n\nSyntax: `Q.gate(state, gate, qubit)`',
            'Q.entangle': 'Entangle two qubits\n\nSyntax: `Q.entangle(state, q1, q2)`',
            'N.net': 'Create neural network\n\nSyntax: `N.net(size)`\nReturns: Neural network',
            'N.match': 'Pattern matching\n\nSyntax: `N.match(net, pattern)`',
            'G.fitness': 'Evaluate population fitness\n\nSyntax: `G.fitness(population)`',
            'G.cross': 'Genetic crossover\n\nSyntax: `G.cross(parents)`',
            'S.graph': 'Create knowledge graph\n\nSyntax: `S.graph(data)`',
            'S.reason': 'Symbolic reasoning\n\nSyntax: `S.reason(graph, query)`'
        };
        
        if (docs[word]) {
            return new vscode.Hover(new vscode.MarkdownString(docs[word]));
        }
        
        return null;
    }
}

// Definition Provider
class APLDefinitionProvider {
    provideDefinition(document, position) {
        // Implement jump-to-definition for functions
        return null;
    }
}

// Symbol Provider
class APLSymbolProvider {
    provideDocumentSymbols(document) {
        const symbols = [];
        const text = document.getText();
        
        // Find function declarations
        const funcRegex = /function\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
        let match;
        
        while ((match = funcRegex.exec(text)) !== null) {
            const name = match[1];
            const pos = document.positionAt(match.index);
            const range = new vscode.Range(pos, pos);
            
            symbols.push(new vscode.DocumentSymbol(
                name,
                'Function',
                vscode.SymbolKind.Function,
                range,
                range
            ));
        }
        
        return symbols;
    }
}

// Formatting Provider
class APLFormattingProvider {
    provideDocumentFormattingEdits(document) {
        const edits = [];
        // Implement basic formatting
        return edits;
    }
}

// Diagnostics
function updateDiagnostics(document) {
    const diagnostics = [];
    
    const config = vscode.workspace.getConfiguration('apl');
    if (!config.get('linting')) {
        diagnosticCollection.set(document.uri, diagnostics);
        return;
    }
    
    try {
        const apl = new APL();
        const result = apl.compile(document.getText());
        
        if (!result.success) {
            const diagnostic = new vscode.Diagnostic(
                new vscode.Range(0, 0, 0, 0),
                result.error,
                vscode.DiagnosticSeverity.Error
            );
            diagnostics.push(diagnostic);
        }
    } catch (error) {
        // Ignore
    }
    
    diagnosticCollection.set(document.uri, diagnostics);
}

// Helper functions
function getBytecodeHTML(result) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { 
                    font-family: monospace; 
                    padding: 20px; 
                    background: #1e1e1e; 
                    color: #d4d4d4; 
                }
                pre { 
                    background: #252526; 
                    padding: 15px; 
                    border-radius: 5px; 
                    overflow-x: auto;
                }
                .success { color: #4ec9b0; }
                .header { color: #569cd6; font-weight: bold; }
            </style>
        </head>
        <body>
            <h2 class="header">APL Bytecode</h2>
            <div class="success">Compilation: SUCCESS</div>
            <p>Mode: ${result.sourceMode}</p>
            <p>Operations: ${result.code?.operations?.length || 0}</p>
            <pre>${JSON.stringify(result.code, null, 2)}</pre>
        </body>
        </html>
    `;
}

function deactivate() {
    if (diagnosticCollection) {
        diagnosticCollection.dispose();
    }
    if (outputChannel) {
        outputChannel.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};
