import { isStringObject } from 'util/types';
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

    test('Addition integer function calls', async () => {
        const result = await harness.evaluateCode(`logI(1 + 2 + 3);`);
        expect(isStringObject(result));
        expect(result.trim()).toEqual('6');
    });

    test('Addition float function calls', async () => {
        const result = await harness.evaluateCode(`logF(3.5 + 4.5);`);
        expect(isStringObject(result));
        expect(result.trim()).toEqual('8');
    });

    test('Subtraction integer function calls', async () => {
        const result = await harness.evaluateCode(`logI(1 - 2 - 3);`);
        expect(isStringObject(result));
        expect(result.trim()).toEqual('-4');
    });

    test('Subtraction float function calls', async () => {
        const result = await harness.evaluateCode(`logF(0.5 - .25);`);
        expect(isStringObject(result));
        expect(result.trim()).toEqual('0.25');
    });

    test('Mixed math float function calls', async () => {
        const result = await harness.evaluateCode(`logF(3.5 + 4.5 * 2.0);`);
        expect(isStringObject(result));
        expect(result.trim()).toEqual('12.5');
    });

    test('Mixed math int function calls', async () => {
        const result = await harness.evaluateCode(`logI(3 / 2 + 2);`);
        expect(isStringObject(result));
        expect(result.trim()).toEqual('3');
    });
});
