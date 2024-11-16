import { isStringObject } from 'util/types';
import { TypeScriptTestHarness } from './harness/testHarness.typescript';

const TIMEOUT_MS: number = 15_000;

/**
 * console.log() seems to colorize numbers resulting in them getting
 * wrapped in some additional bytes, presumably encoding this information.
 * 
 * This function simulates that behavior in order to make it easy to write tests.
 * @param number The number to encode.
 * @returns The number encoded with console colorization information.
 */
function colorizedNumber(number: number): string {
    return `\x1b[33m${number}\x1b[39m`;
}

describe('Demos compiling to and running as TypeScript', () => {
    const harness = new TypeScriptTestHarness();

    test('String function calls', async () => {
        const result = await harness.evaluateCode(`logS("Hello world");`);
        expect(result).toBe('Hello world');
    }, TIMEOUT_MS);

    test('Integer function calls', async () => {
        const result = await harness.evaluateCode(`logI(1234);`);
        expect(result).toEqual(colorizedNumber(1234));
    }, TIMEOUT_MS);

    test('Addition function calls', async () => {
        const result = await harness.evaluateCode(`logI(1 + 2 + 3);`);
        expect(isStringObject(result));
        expect(result.trim()).toEqual(colorizedNumber(6));
    }, TIMEOUT_MS);

    test('Subtraction function calls', async () => {
        const result = await harness.evaluateCode(`logI(1 - 2 - 3);`);
        expect(isStringObject(result));
        expect(result.trim()).toEqual(colorizedNumber(-4));
    }, TIMEOUT_MS);
});
