import { lexCode, StringEnumerator } from '../src/lexer';
import { AstNode, CallNode, FloatNode, IntegerNode, parse, StringNode } from '../src/parser';

describe('Function parsing tests', () => {
    test('No parameter function call', async () => {
        const stringEnumerator = new StringEnumerator(`println()`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(0);
    });

    test('Single parameter function call', async () => {
        const stringEnumerator = new StringEnumerator(`println("Hello world")`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(1);
        expect((((tree as CallNode).parameters[0]) as StringNode).text).toBe('Hello world');
    });

    test('Two parameter function call', async () => {
        const stringEnumerator = new StringEnumerator(`println("Hello", "Goodbye")`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(2);
        expect((((tree as CallNode).parameters[0]) as StringNode).text).toBe('Hello');
        expect((((tree as CallNode).parameters[1]) as StringNode).text).toBe('Goodbye');
    });

    test('Extra token', async () => {
        const stringEnumerator = new StringEnumerator(`println("Hello", "Goodbye")`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(2);
        expect((((tree as CallNode).parameters[0]) as StringNode).text).toBe('Hello');
        expect((((tree as CallNode).parameters[1]) as StringNode).text).toBe('Goodbye');
    });
});

describe('Numeric parsing tests', () => {
    test('Integer parsing', async () => {
        const stringEnumerator = new StringEnumerator(`println(3)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(1);
        expect((((tree as CallNode).parameters[0]) as IntegerNode).value).toBe(3);
    });

    test('Integer parsing', async () => {
        const stringEnumerator = new StringEnumerator(`println(1234.567)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(1);
        expect((((tree as CallNode).parameters[0]) as FloatNode).value).toBe(1234.567);
    });
});
