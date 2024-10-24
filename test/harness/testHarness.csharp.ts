import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as child from 'child_process';
import * as util from 'util';
import { lexCode, StringEnumerator } from '../../src/lexer';
import { AstNode, parse } from '../../src/parser';
import { SymbolTable } from '../../src/symbols';
import { CSharpCodeGenerator } from '../../src/codeGenerator';

const TestsOutputDir: string = 'test_outputs';

export class CSharpTestHarness {
    async evaluateCode(code: string): Promise<string> {
        // Create a directory for the test run.
        const testId = randomUUID();
        const testDirectory = `${TestsOutputDir}/${testId}`;
        await fs.mkdir(testDirectory, { recursive: true });

        // Generate the code.
        // Write the test.
        const testPath = `${testDirectory}/Test.cs`;
        await fs.writeFile(testPath, this.generateCode(code));

        // Copy the boilerplate.
        const projectPath = `${testDirectory}/Test.csproj`;
        await fs.writeFile(projectPath, ProjectFileText);

        // Compile and run the project.
        const workingDirectory = process.cwd();
        process.chdir(testDirectory);
        const execFile = util.promisify(child.exec);
        const childProcess = await execFile(`dotnet run`);
        process.chdir(workingDirectory);

        console.log(childProcess.stdout);
        return childProcess.stdout.trim();
    }

    generateCode(code: string): string {
        const stringEnumerator = new StringEnumerator(code);
        const lexemes = lexCode(stringEnumerator); 
        const tree = parse(lexemes);

        var symbolTable = new SymbolTable();

        // TODO: type check.
        //const semanticModel = buildSemanticModel(tree as AstNode, symbolTable);

        const generator = new CSharpCodeGenerator(tree as AstNode);
        generator.visit();

        return generator.code;
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
