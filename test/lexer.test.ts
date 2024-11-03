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
    test('String', async () => {
        const lexemes = lexCode(
            new StringEnumerator(
                `
                "Hello world"
                `));

        const lexemesArray = Array.from(lexemes);

        expect(lexemesArray.length).toBe(1);
        expect(lexemesArray[0]).toStrictEqual({ type: LexemeType.String, text: "Hello world" });
    });

    test('Function', async () => {
        const lexemes = lexCode(
            new StringEnumerator(
                `println("Hello world")
                `));

        const lexemesArray = Array.from(lexemes);

        expect(lexemesArray.length).toBe(4);
        expect(lexemesArray[0]).toStrictEqual({ type: LexemeType.Identifier, text: "println" });
        expect(lexemesArray[1]).toStrictEqual({ type: LexemeType.LeftParen, text: undefined });
        expect(lexemesArray[2]).toStrictEqual({ type: LexemeType.String, text: "Hello world" });
        expect(lexemesArray[3]).toStrictEqual({ type: LexemeType.RightParen, text: undefined });
    });

    test('Integer', async () => {
        const lexemes = lexCode(
            new StringEnumerator(`3`));

        const lexemesArray = Array.from(lexemes);

        expect(lexemesArray.length).toBe(1);
        expect(lexemesArray[0]).toStrictEqual({ type: LexemeType.Integer, text: "3" });
    });

    test('Float', async () => {
        const lexemes = lexCode(
            new StringEnumerator(`15.7256`));

        const lexemesArray = Array.from(lexemes);

        expect(lexemesArray.length).toBe(1);
        expect(lexemesArray[0]).toStrictEqual({ type: LexemeType.Float, text: "15.7256" });
    });
});
