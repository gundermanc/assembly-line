import { CSharpTestHarness } from './harness/testHarness.csharp';

describe('Demo C# test', () => {
    const harness = new CSharpTestHarness();

    test('Demos compiling and running C#', async () => {
        const result = await harness.evaluateCode(`System.Console.WriteLine("hello");`);
        expect(result).toBe('hello');
    });
});
