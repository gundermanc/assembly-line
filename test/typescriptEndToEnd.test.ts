import { TypeScriptTestHarness } from './harness/testHarness.typescript';

describe('Demos compiling to and running as TypeScript', () => {
    const harness = new TypeScriptTestHarness();

    test('Demos compiling and running TypeScript', async () => {
        const result = await harness.evaluateCode(`log("Hello world");`);
        expect(result).toBe('Hello world');
    }, 15000);
});
