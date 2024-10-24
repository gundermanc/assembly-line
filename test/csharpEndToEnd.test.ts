import { CSharpTestHarness } from './harness/testHarness.csharp';

describe('Demos compiling to and running as C#', () => {
    const harness = new CSharpTestHarness();

    test('Demos compiling and running C#', async () => {
        const result = await harness.evaluateCode(`log("Hello world");`);
        expect(result).toBe('Hello world');
    });
});
