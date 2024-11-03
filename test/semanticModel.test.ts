import { lexCode, StringEnumerator } from "../src/lexer";
import { AstNode, CallNode, parse } from "../src/parser";
import { buildSemanticModel, SemanticError, SemanticNode } from '../src/semanticModel';
import { PlatformFunctionDefinition, SymbolTable, SymbolType } from "../src/symbols";

describe('Function call semantic model tests', () => {
    test.only('No parameter matching function call', async () => {
        const stringEnumerator = new StringEnumerator(`log()`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('log', 'Console.WriteLine', [], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expect((semanticModel as SemanticNode).returnType).toBe('void');
    });

    test.only('No parameter mis-matched count function call', async () => {
        const stringEnumerator = new StringEnumerator(`log()`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('log', 'Console.WriteLine', ['string'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expect(semanticModel).toBe(SemanticError.MismatchedParameterCount);
    });

    test.only('Yes parameter matching type function call', async () => {
        const stringEnumerator = new StringEnumerator(`log("Hello")`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('log', 'Console.WriteLine', ['string'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expect((semanticModel as SemanticNode).returnType).toBe('void');
    });
});

describe('Numeric type semantic model tests', () => {
    test.only('Integer type tests', async () => {
        const stringEnumerator = new StringEnumerator(`log(12345)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('log', 'Console.WriteLine', ['i32'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expect((semanticModel as SemanticNode).returnType).toBe('void');
    });

    test.only('Integer type tests', async () => {
        const stringEnumerator = new StringEnumerator(`log(54321.9876)`);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();
        symbolTable.defineSymbol(new PlatformFunctionDefinition('log', 'Console.WriteLine', ['f32'], 'void'))

        const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);
        expect((semanticModel as SemanticNode).returnType).toBe('void');
    });
});
