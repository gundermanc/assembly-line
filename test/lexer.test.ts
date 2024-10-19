import { lexCode, LexemeType, StringEnumerator } from '../src/lexer';

describe('String enumerator tests', () => {
    test('Empty length string', async () => {
        const lexer = new StringEnumerator('');

        // Check initial values.
        expect(lexer.peek()).toBeUndefined();
        expect(lexer.next()).toBeUndefined();

        // Ensure we're bounds checking at the end.
        expect(lexer.peek()).toBeUndefined();
        expect(lexer.next()).toBeUndefined();
    });

    test('Single char string', async () => {
        const lexer = new StringEnumerator('A');

        // Check initial values.
        expect(lexer.peek()).toBeUndefined();
        expect(lexer.next()).toBe('A');

        // Ensure we're bounds checking at the end.
        expect(lexer.peek()).toBeUndefined();
        expect(lexer.next()).toBeUndefined();
    });

    test('Double char string', async () => {
        const lexer = new StringEnumerator('Ab');

        // Check initial values.
        expect(lexer.peek()).toBe('b');
        expect(lexer.next()).toBe('A');

        // Ensure we're bounds checking at the end.
        expect(lexer.peek()).toBeUndefined();
        expect(lexer.next()).toBe('b');
    });

    test('Triple char string', async () => {
        const lexer = new StringEnumerator('Abc');

        // Check initial values.
        expect(lexer.peek()).toBe('b');
        expect(lexer.next()).toBe('A');

        expect(lexer.peek()).toBe('c');
        expect(lexer.next()).toBe('b');

        // Ensure we're bounds checking at the end.
        expect(lexer.peek()).toBeUndefined;
        expect(lexer.next()).toBe('c');
    });

    test('Start segment', async () => {
        const lexer = new StringEnumerator('Abc');

        lexer.startSegment();
        lexer.next();
        lexer.next();

        expect(lexer.endSegment()).toBe('Ab');
    });
});

describe('Lexer tests', () => {
    test('Empty length string', async () => {
        const lexemes = lexCode(
            new StringEnumerator(
                `
                "Hello world"
                `));

        const lexemesArray = Array.from(lexemes);

        expect(lexemesArray.length).toBe(1);
        expect(lexemesArray[0]).toBe({ type: LexemeType.String, text: "Hello world" });
    });
});
