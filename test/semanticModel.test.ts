import { lexCode, StringEnumerator } from "../src/lexer";
import { AstNode, CallNode, parse } from "../src/parser";
import { buildSemanticModel, SemanticError, SemanticModel } from '../src/semanticModel';
import { PlatformFunctionDefinition, SymbolTable, SymbolType } from "../src/symbols";

function expectErrors(semanticModel: SemanticModel, errors: SemanticError[]): void {
    const modelErrors = semanticModel.errors();

    expect(modelErrors.size).toBe(errors.length);

    let i = 0;
    for (const item in modelErrors) {
        expect(item).toBe(errors[i]);
        i++;
    }
}

describe('Function call semantic model tests', () => {
    test('No parameter matching function call', async () => {
        const stringEnumerator = new StringEnumerator(`log()`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('log', 'Console.WriteLine', [], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expect(semanticModel.nodeTypes.get(tree as AstNode)).toBe('void');
    });

    test('No parameter mis-matched count function call', async () => {
        const stringEnumerator = new StringEnumerator(`log()`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('log', 'Console.WriteLine', ['string'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expect(semanticModel.nodeTypes.get(tree as AstNode)).toBe(SemanticError.MismatchedParameterCount);
    });

    test('Yes parameter matching type function call', async () => {
        const stringEnumerator = new StringEnumerator(`log("Hello")`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('log', 'Console.WriteLine', ['string'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expect(semanticModel.nodeTypes.get(tree as AstNode)).toBe('void');
    });
});

describe('Numeric type semantic model tests', () => {
    test('Integer type tests', async () => {
        const stringEnumerator = new StringEnumerator(`log(12345)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('log', 'Console.WriteLine', ['i32'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expect(semanticModel.nodeTypes.get(tree as AstNode)).toBe('void');
    });

    test('Integer type tests', async () => {
        const stringEnumerator = new StringEnumerator(`log(54321.9876)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('log', 'Console.WriteLine', ['f32'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expect(semanticModel.nodeTypes.get(tree as AstNode)).toBe('void');
    });
});

describe('Operator type semantic model tests', () => {
    test('Matching Add and Subtract types tests', async () => {
        const stringEnumerator = new StringEnumerator(`log(3 - 4 + 5)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('log', 'Console.WriteLine', ['i32'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expect(semanticModel.nodeTypes.get(tree as AstNode)).toBe('void');
    });

    test('Mismatching Add types tests', async () => {
        const stringEnumerator = new StringEnumerator(`log(3 - 4 + 5.3)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('log', 'Console.WriteLine', ['i32'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expectErrors(semanticModel, [SemanticError.IncompatibleOperands, SemanticError.MismatchedParameterType]);
    });

    test('Matching Multiply and Divide types tests', async () => {
        const stringEnumerator = new StringEnumerator(`log(3 / 4 * 5)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('log', 'Console.WriteLine', ['i32'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expectErrors(semanticModel, []);
    });

    test('Mismatching Multiply types tests', async () => {
        const stringEnumerator = new StringEnumerator(`log(3.0 * 4)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('log', 'Console.WriteLine', ['i32'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expectErrors(semanticModel, [SemanticError.IncompatibleOperands]);
    });

    test('Mismatching Divide types tests', async () => {
        const stringEnumerator = new StringEnumerator(`log(3.0 * 4)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('log', 'Console.WriteLine', ['i32'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expectErrors(semanticModel, [SemanticError.IncompatibleOperands]);
    });
});

describe('Boolean type semantic model tests', () => {
    test('Boolean literal type tests', async () => {
        const stringEnumerator = new StringEnumerator(`println(true)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('println', 'console.log', ['bool'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expect(semanticModel.nodeTypes.get((tree as CallNode).parameters[0])).toBe('bool');
    });

    test('Boolean AND operation type tests', async () => {
        const stringEnumerator = new StringEnumerator(`println(true && false)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('println', 'console.log', ['bool'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expect(semanticModel.nodeTypes.get((tree as CallNode).parameters[0])).toBe('bool');
    });

    test('Boolean OR operation type tests', async () => {
        const stringEnumerator = new StringEnumerator(`println(false || true)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('println', 'console.log', ['bool'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expect(semanticModel.nodeTypes.get((tree as CallNode).parameters[0])).toBe('bool');
    });

    test('Boolean NOT operation type tests', async () => {
        const stringEnumerator = new StringEnumerator(`println(!true)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('println', 'console.log', ['bool'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expect(semanticModel.nodeTypes.get((tree as CallNode).parameters[0])).toBe('bool');
    });

    test('Boolean operation with incompatible operands', async () => {
        const stringEnumerator = new StringEnumerator(`println(true && 5)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('println', 'console.log', ['bool'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expectErrors(semanticModel, [SemanticError.IncompatibleOperands]);
    });

    test('NOT operation with incompatible operand', async () => {
        const stringEnumerator = new StringEnumerator(`println(!5)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('println', 'console.log', ['i32'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expectErrors(semanticModel, [SemanticError.IncompatibleOperands]);
    });
});
