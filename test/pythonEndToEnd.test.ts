import { PythonTestHarness } from './harness/testHarness.python';

describe('Demos compiling to and running as Python', () => {
    const harness = new PythonTestHarness();

    test('Demos compiling and running Python', async () => {
        const result = await harness.evaluateCode(`log("Hello world");`);
        expect(result).toBe('Hello world');
    });
});
