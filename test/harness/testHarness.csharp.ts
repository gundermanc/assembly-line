import { AstNode } from '../../src/parser';
import { CSharpCodeGenerator } from '../../src/codeGenerator';
import { TestHarnessBase } from './testHarness';
import { SemanticModel } from '../../src/semanticModel';
import { SymbolTable } from '../../src/symbols';

export class CSharpTestHarness extends TestHarnessBase {
    generateCodeFromNode(astNode: AstNode, semanticModel: SemanticModel): string {
        const generator = new CSharpCodeGenerator(astNode, semanticModel);
        generator.visit();

        return generator.code;
    }

    generateProjectFile(): string {
        return ProjectFileText;
    }

    generateProjectName(): string {
        return 'Test.csproj';
    }

    generateFileName(): string {
        return 'Test.cs';
    }

    generateBuildCommand(): string {
        return 'dotnet run';
    }

    definePlatformSymbols(symbols: SymbolTable): void {
        CSharpCodeGenerator.definePlatformSymbols(symbols);
    }
}

const ProjectFileText = `
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <OutputType>Exe</OutputType>
        <TargetFramework>net8.0</TargetFramework>
        <Nullable>enable</Nullable>
    </PropertyGroup>
</Project>
`;
