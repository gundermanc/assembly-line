import { PythonTestHarness } from './harness/testHarness.python';

describe('Demos compiling to and running as Python', () => {
    const harness = new PythonTestHarness();

    test('String function calls', async () => {
        const result = await harness.evaluateCode(`logS("Hello world");`);
        expect(result).toBe('Hello world');
    });

    test('Integer function calls', async () => {
        const result = await harness.evaluateCode(`logI(1234);`);
        expect(result).toBe('1234');
    });
});
