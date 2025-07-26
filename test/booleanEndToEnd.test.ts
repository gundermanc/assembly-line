import { lexCode, StringEnumerator } from '../src/lexer';
import { AstNode, parse } from '../src/parser';
import { buildSemanticModel } from '../src/semanticModel';
import { SymbolTable } from '../src/symbols';
import { TypeScriptCodeGenerator, PythonCodeGenerator } from '../src/codeGenerator';

describe('Boolean End-to-End Tests', () => {
    test('Boolean literal true generates correct code', async () => {
        const code = 'logB(true)';
        const stringEnumerator = new StringEnumerator(code);
        const lexemes = lexCode(stringEnumerator);
        const tree = parse(lexemes) as AstNode;
        
        // TypeScript
        let symbolTable = new SymbolTable();
        TypeScriptCodeGenerator.definePlatformSymbols(symbolTable);
        let semanticModel = buildSemanticModel(tree, symbolTable);
        expect(semanticModel.hasError()).toBe(false);
        
        let tsGen = new TypeScriptCodeGenerator(tree, semanticModel);
        tsGen.visit();
        expect(tsGen.code.trim()).toBe('console.log(true);');
        
        // Python
        symbolTable = new SymbolTable();
        PythonCodeGenerator.definePlatformSymbols(symbolTable);
        semanticModel = buildSemanticModel(tree, symbolTable);
        expect(semanticModel.hasError()).toBe(false);
        
        let pyGen = new PythonCodeGenerator(tree, semanticModel);
        pyGen.visit();
        expect(pyGen.code.trim()).toBe('import math\nprint(True);');
    });

    test('Boolean AND operation generates correct code', async () => {
        const code = 'logB(true && false)';
        const stringEnumerator = new StringEnumerator(code);
        const lexemes = lexCode(stringEnumerator);
        const tree = parse(lexemes) as AstNode;
        
        // TypeScript
        let symbolTable = new SymbolTable();
        TypeScriptCodeGenerator.definePlatformSymbols(symbolTable);
        let semanticModel = buildSemanticModel(tree, symbolTable);
        expect(semanticModel.hasError()).toBe(false);
        
        let tsGen = new TypeScriptCodeGenerator(tree, semanticModel);
        tsGen.visit();
        expect(tsGen.code.trim()).toBe('console.log(true && false);');
        
        // Python
        symbolTable = new SymbolTable();
        PythonCodeGenerator.definePlatformSymbols(symbolTable);
        semanticModel = buildSemanticModel(tree, symbolTable);
        expect(semanticModel.hasError()).toBe(false);
        
        let pyGen = new PythonCodeGenerator(tree, semanticModel);
        pyGen.visit();
        expect(pyGen.code.trim()).toBe('import math\nprint(True and False);');
    });

    test('Boolean NOT operation generates correct code', async () => {
        const code = 'logB(!false)';
        const stringEnumerator = new StringEnumerator(code);
        const lexemes = lexCode(stringEnumerator);
        const tree = parse(lexemes) as AstNode;
        
        // TypeScript
        let symbolTable = new SymbolTable();
        TypeScriptCodeGenerator.definePlatformSymbols(symbolTable);
        let semanticModel = buildSemanticModel(tree, symbolTable);
        expect(semanticModel.hasError()).toBe(false);
        
        let tsGen = new TypeScriptCodeGenerator(tree, semanticModel);
        tsGen.visit();
        expect(tsGen.code.trim()).toBe('console.log(!false);');
        
        // Python
        symbolTable = new SymbolTable();  
        PythonCodeGenerator.definePlatformSymbols(symbolTable);
        semanticModel = buildSemanticModel(tree, symbolTable);
        expect(semanticModel.hasError()).toBe(false);
        
        let pyGen = new PythonCodeGenerator(tree, semanticModel);
        pyGen.visit();
        expect(pyGen.code.trim()).toBe('import math\nprint(not False);');
    });
});