import { lexCode, StringEnumerator } from '../src/lexer';
import { AstNode, CallNode, parse, StringNode } from '../src/parser';

describe('Function parsing tests', () => {
    test.only('No parameter function call', async () => {
        const stringEnumerator = new StringEnumerator(`println()`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters).toBeUndefined();
    });

    test.only('Single parameter function call', async () => {
        const stringEnumerator = new StringEnumerator(`println("Hello world")`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(1);
        expect((((tree as CallNode).parameters[0]) as StringNode).text).toBe('Hello world');
    });

    test.only('Two parameter function call', async () => {
        const stringEnumerator = new StringEnumerator(`println("Hello", "Goodbye")`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(2);
        expect((((tree as CallNode).parameters[0]) as StringNode).text).toBe('Hello');
        expect((((tree as CallNode).parameters[1]) as StringNode).text).toBe('Goodbye');
    });

    test.only('Extra token', async () => {
        const stringEnumerator = new StringEnumerator(`println("Hello", "Goodbye")`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(2);
        expect((((tree as CallNode).parameters[0]) as StringNode).text).toBe('Hello');
        expect((((tree as CallNode).parameters[1]) as StringNode).text).toBe('Goodbye');
    });
});
