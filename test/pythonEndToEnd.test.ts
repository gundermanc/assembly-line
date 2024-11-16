import { isStringObject } from 'util/types';
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

    test('Addition integer function calls', async () => {
        const result = await harness.evaluateCode(`logI(1 + 2 + 3);`);
        expect(isStringObject(result));
        expect(result.trim()).toEqual('6');
    });

    test('Addition float function calls', async () => {
        const result = await harness.evaluateCode(`logI(3.5 + 4.5);`);
        expect(isStringObject(result));
        expect(result.trim()).toEqual('8.0');
    });

    test('Subtraction integer function calls', async () => {
        const result = await harness.evaluateCode(`logI(1 - 2 - 3);`);
        expect(isStringObject(result));
        expect(result.trim()).toEqual('-4');
    });

    test('Subtraction float function calls', async () => {
        const result = await harness.evaluateCode(`logI(0.5 - .25);`);
        expect(isStringObject(result));
        expect(result.trim()).toEqual('0.25');
    });
});
