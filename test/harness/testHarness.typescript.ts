import { TypeScriptCodeGenerator } from '../../src/codeGenerator';
import { AstNode } from '../../src/parser';
import { SemanticModel } from '../../src/semanticModel';
import { SymbolTable } from '../../src/symbols';
import { TestHarnessBase } from './testHarness';

export class TypeScriptTestHarness extends TestHarnessBase {
    generateCodeFromNode(astNode: AstNode, semanticModel: SemanticModel): string {
        const generator = new TypeScriptCodeGenerator(astNode, semanticModel);
        generator.visit();

        return generator.code;
    }

    generateProjectFile(): string {
        return `
        {
            "compilerOptions": {
                "baseUrl": ".",
                "module": "CommonJS",
                "moduleResolution": "node",
                "noImplicitAny": true,
                "outDir": ".",
                "paths": {
                    "*": ["node_modules/*"]
                },
                "preserveConstEnums": true,
                "removeComments": true,
                "sourceMap": true,
                "strict": true,
                "target": "ESNext"
            },
            "files": ["main.ts"]
        }
        `;
    }

    generateProjectName(): string {
        return 'tsconfig.json';
    }

    generateFileName(): string {
        return 'main.ts';
    }

    generateBuildCommand(): string {
        return 'npx tsc -p tsconfig.json && node main.js';
    }

    definePlatformSymbols(symbols: SymbolTable): void {
        TypeScriptCodeGenerator.definePlatformSymbols(symbols);
    }
}
