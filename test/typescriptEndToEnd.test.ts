import { TypeScriptTestHarness } from './harness/testHarness.typescript';

describe('Demos compiling to and running as C#', () => {
    const harness = new TypeScriptTestHarness();

    test('Demos compiling and running C#', async () => {
        const result = await harness.evaluateCode(`log("Hello world");`);
        expect(result).toBe('Hello world');
    }, 15000);
});
