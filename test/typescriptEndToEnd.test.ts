import { TypeScriptTestHarness } from './harness/testHarness.typescript';

describe('Demos compiling to and running as TypeScript', () => {
    const harness = new TypeScriptTestHarness();

    test('String function calls', async () => {
        const result = await harness.evaluateCode(`logS("Hello world");`);
        expect(result).toBe('Hello world');
    }, 15000);

    test('Integer function calls', async () => {
        const result = await harness.evaluateCode(`logI(1234);`);
        expect(result).toBe('1234');
    }, 15000);
});
