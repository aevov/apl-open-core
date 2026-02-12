// APL Framework Test Suite
// Run: node test.js

const APL = require('./src/index.js');

async function runTests() {
    console.log('🧪 APL Framework Test Suite\n');
    
    let passed = 0;
    let failed = 0;
    
    // Test 1: Initialization
    try {
        const apl = new APL();
        console.log('✅ Test 1: APL initialization');
        passed++;
    } catch (e) {
        console.log('❌ Test 1: APL initialization -', e.message);
        failed++;
    }
    
    // Test 2: ASCII to Runic conversion
    try {
        const apl = new APL();
        const runic = apl.toRunic('Q.super');
        if (runic === 'ᛩ') {
            console.log('✅ Test 2: ASCII to Runic conversion');
            passed++;
        } else {
            throw new Error(`Expected ᛩ, got ${runic}`);
        }
    } catch (e) {
        console.log('❌ Test 2: ASCII to Runic conversion -', e.message);
        failed++;
    }
    
    // Test 3: Runic to ASCII conversion
    try {
        const apl = new APL();
        const ascii = apl.toAscii('ᛩ');
        if (ascii === 'Q.super') {
            console.log('✅ Test 3: Runic to ASCII conversion');
            passed++;
        } else {
            throw new Error(`Expected Q.super, got ${ascii}`);
        }
    } catch (e) {
        console.log('❌ Test 3: Runic to ASCII conversion -', e.message);
        failed++;
    }
    
    // Test 4: Compilation
    try {
        const apl = new APL();
        const compiled = apl.compile('// test\nprint("hello")');
        if (compiled.success) {
            console.log('✅ Test 4: Code compilation');
            passed++;
        } else {
            throw new Error(compiled.error);
        }
    } catch (e) {
        console.log('❌ Test 4: Code compilation -', e.message);
        failed++;
    }
    
    // Test 5: Native function registration
    try {
        const apl = new APL();
        let called = false;
        apl.registerNative('testFunc', () => { called = true; return 42; });
        if (called === false) { // Should not be called yet
            console.log('✅ Test 5: Native function registration');
            passed++;
        } else {
            throw new Error('Function called prematurely');
        }
    } catch (e) {
        console.log('❌ Test 5: Native function registration -', e.message);
        failed++;
    }
    
    // Test 6: Standard library functions
    try {
        const apl = new APL();
        if (apl.runtime.globals.has('sqrt') && 
            apl.runtime.globals.has('print')) {
            console.log('✅ Test 6: Standard library loaded');
            passed++;
        } else {
            throw new Error('Standard library not loaded');
        }
    } catch (e) {
        console.log('❌ Test 6: Standard library loaded -', e.message);
        failed++;
    }
    
    // Test 7: Mode detection
    try {
        const apl = new APL();
        const asciiMode = apl.runicMap.normalize('Q.super');
        const runicMode = apl.runicMap.normalize('ᛩ');
        
        if (asciiMode.mode === 'ascii' && runicMode.mode === 'runic') {
            console.log('✅ Test 7: Mode detection');
            passed++;
        } else {
            throw new Error(`Modes incorrect: ${asciiMode.mode}, ${runicMode.mode}`);
        }
    } catch (e) {
        console.log('❌ Test 7: Mode detection -', e.message);
        failed++;
    }
    
    // Test 8: Version check
    try {
        if (APL.version === '1.0.0') {
            console.log('✅ Test 8: Version check');
            passed++;
        } else {
            throw new Error(`Expected 1.0.0, got ${APL.version}`);
        }
    } catch (e) {
        console.log('❌ Test 8: Version check -', e.message);
        failed++;
    }
    
    // Summary
    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
    
    if (failed === 0) {
        console.log('🎉 All tests passed! Framework is ready for launch.');
        return 0;
    } else {
        console.log('⚠️  Some tests failed. Please review.');
        return 1;
    }
}

// Run tests
runTests().then(code => {
    process.exit(code);
}).catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
