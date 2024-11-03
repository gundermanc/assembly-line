import { CSharpTestHarness } from './harness/testHarness.csharp';

describe('Demos compiling to and running as C#', () => {
    const harness = new CSharpTestHarness();

    test('String function calls', async () => {
        const result = await harness.evaluateCode(`logS("Hello world");`);
        expect(result).toBe('Hello world');
    });

    test('Integer function calls', async () => {
        const result = await harness.evaluateCode(`logI(1234);`);
        expect(result).toBe('1234');
    });
});
