import { AstNode } from '../../src/parser';
import { CSharpCodeGenerator } from '../../src/codeGenerator';
import { TestHarnessBase } from './testHarness';

export class CSharpTestHarness extends TestHarnessBase {
    generateCodeFromNode(astNode: AstNode): string {
        const generator = new CSharpCodeGenerator(astNode);
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
