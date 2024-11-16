import { lexCode, StringEnumerator } from '../src/lexer';
import { AstNode, BinaryOperationNode, CallNode, FloatNode, IntegerNode, Operation, parse, StringNode } from '../src/parser';

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
    })});

describe('Operator parsing tests', () => {
    test('Single add parsing', async () => {
        const stringEnumerator = new StringEnumerator(`println(5 + 10)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(1);
        const operator = (((tree as CallNode).parameters[0]) as BinaryOperationNode);
        expect(operator.operation).toBe(Operation.Add);
        expect((operator.left as IntegerNode).value).toBe(5);
        expect((operator.right as IntegerNode).value).toBe(10);
    });

    test('Single subtract parsing', async () => {
        const stringEnumerator = new StringEnumerator(`println(5 - 10)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(1);
        const operator = (((tree as CallNode).parameters[0]) as BinaryOperationNode);
        expect(operator.operation).toBe(Operation.Subtract);
        expect((operator.left as IntegerNode).value).toBe(5);
        expect((operator.right as IntegerNode).value).toBe(10);
    });

    test('Multiple add and subtract parsing', async () => {
        const stringEnumerator = new StringEnumerator(`println(5 + 10 - 12)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(1);
        const operator = (((tree as CallNode).parameters[0]) as BinaryOperationNode);
        expect(operator.operation).toBe(Operation.Add);
        expect((operator.left as IntegerNode).value).toBe(5);
        const right = (operator.right as BinaryOperationNode);
        expect(right.operation).toBe(Operation.Subtract);
        expect((right.left as IntegerNode).value).toBe(10);
        expect((right.right as IntegerNode).value).toBe(12);
    });
});
