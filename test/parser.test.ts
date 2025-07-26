import { lexCode, StringEnumerator } from '../src/lexer';
import { AstNode, BinaryOperationNode, BooleanNode, CallNode, FloatNode, IntegerNode, Operation, parse, StringNode, UnaryOperationNode } from '../src/parser';

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

    test('Multiplication first parsing', async () => {
        const stringEnumerator = new StringEnumerator(`println(5 * 10 + 12)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(1);
        
        // Should parse as (5 * 10) + 12 - multiplication has higher precedence
        const operator = (((tree as CallNode).parameters[0]) as BinaryOperationNode);
        expect(operator.operation).toBe(Operation.Add);
        
        const left = (operator.left as BinaryOperationNode);
        expect(left.operation).toBe(Operation.Multiply);
        expect((left.left as IntegerNode).value).toBe(5);
        expect((left.right as IntegerNode).value).toBe(10);
        
        expect((operator.right as IntegerNode).value).toBe(12);
    });

    test('Multiplication second parsing', async () => {
        const stringEnumerator = new StringEnumerator(`println(12 + 5 * 10)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(1);
        const operator = (((tree as CallNode).parameters[0]) as BinaryOperationNode);
        expect(operator.operation).toBe(Operation.Add);
        expect((operator.left as IntegerNode).value).toBe(12);
        const right = (operator.right as BinaryOperationNode);
        expect(right.operation).toBe(Operation.Multiply);
        expect((right.left as IntegerNode).value).toBe(5);
        expect((right.right as IntegerNode).value).toBe(10);
    });
});

describe('Boolean parsing tests', () => {
    test('Boolean literal true parsing', async () => {
        const stringEnumerator = new StringEnumerator(`println(true)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(1);
        const boolNode = (((tree as CallNode).parameters[0]) as BooleanNode);
        expect(boolNode.value).toBe(true);
    });

    test('Boolean literal false parsing', async () => {
        const stringEnumerator = new StringEnumerator(`println(false)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(1);
        const boolNode = (((tree as CallNode).parameters[0]) as BooleanNode);
        expect(boolNode.value).toBe(false);
    });

    test('Boolean AND operation parsing', async () => {
        const stringEnumerator = new StringEnumerator(`println(true && false)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(1);
        const operator = (((tree as CallNode).parameters[0]) as BinaryOperationNode);
        expect(operator.operation).toBe(Operation.And);
        expect((operator.left as BooleanNode).value).toBe(true);
        expect((operator.right as BooleanNode).value).toBe(false);
    });

    test('Boolean OR operation parsing', async () => {
        const stringEnumerator = new StringEnumerator(`println(false || true)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(1);
        const operator = (((tree as CallNode).parameters[0]) as BinaryOperationNode);
        expect(operator.operation).toBe(Operation.Or);
        expect((operator.left as BooleanNode).value).toBe(false);
        expect((operator.right as BooleanNode).value).toBe(true);
    });

    test('Boolean NOT operation parsing', async () => {
        const stringEnumerator = new StringEnumerator(`println(!true)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(1);
        const operator = (((tree as CallNode).parameters[0]) as UnaryOperationNode);
        expect(operator.operation).toBe(Operation.Not);
        expect((operator.operand as BooleanNode).value).toBe(true);
    });

    test('Complex boolean expression parsing', async () => {
        const stringEnumerator = new StringEnumerator(`println(true && false || !true)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        expect((tree as CallNode).symbol).toBe('println');
        expect((tree as CallNode).parameters.length).toBe(1);
        
        // Should parse as: (true && false) || (!true)
        const orOp = (((tree as CallNode).parameters[0]) as BinaryOperationNode);
        expect(orOp.operation).toBe(Operation.Or);
        
        const andOp = (orOp.left as BinaryOperationNode);
        expect(andOp.operation).toBe(Operation.And);
        expect((andOp.left as BooleanNode).value).toBe(true);
        expect((andOp.right as BooleanNode).value).toBe(false);
        
        const notOp = (orOp.right as UnaryOperationNode);
        expect(notOp.operation).toBe(Operation.Not);
        expect((notOp.operand as BooleanNode).value).toBe(true);
    });
});
