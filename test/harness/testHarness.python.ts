import { PythonCodeGenerator } from '../../src/codeGenerator';
import { AstNode } from '../../src/parser';
import { SemanticModel } from '../../src/semanticModel';
import { SymbolTable } from '../../src/symbols';
import { TestHarnessBase } from './testHarness';

export class PythonTestHarness extends TestHarnessBase {
    generateCodeFromNode(astNode: AstNode, semanticModel: SemanticModel): string {
        const generator = new PythonCodeGenerator(astNode, semanticModel);
        generator.visit();

        return generator.code;
    }

    generateProjectFile(): string {
        return `No such thing as a python project`;
    }

    generateProjectName(): string {
        return 'no_project.txt';
    }

    generateFileName(): string {
        return 'main.py';
    }

    generateBuildCommand(): string {
        return 'python main.py';
    }

    definePlatformSymbols(symbols: SymbolTable): void {
        PythonCodeGenerator.definePlatformSymbols(symbols);
    }
}
