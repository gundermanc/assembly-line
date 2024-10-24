import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as child from 'child_process';
import * as util from 'util';
import { lexCode, StringEnumerator } from '../../src/lexer';
import { AstNode, parse } from '../../src/parser';
import { SymbolTable } from '../../src/symbols';

const TestsOutputDir: string = 'test_outputs';

export abstract class TestHarnessBase {
    async evaluateCode(code: string): Promise<string> {
        // Create a directory for the test run.
        const testId = randomUUID();
        const testDirectory = `${TestsOutputDir}/${testId}`;
        await fs.mkdir(testDirectory, { recursive: true });

        // Generate the code.
        // Write the test.
        const testPath = `${testDirectory}/${this.generateFileName()}`;
        await fs.writeFile(testPath, this.generateCode(code));

        // Copy the boilerplate.
        const projectPath = `${testDirectory}/${this.generateProjectName()}`;
        await fs.writeFile(projectPath, this.generateProjectFile());

        // Compile and run the project.
        const workingDirectory = process.cwd();
        process.chdir(testDirectory);
        const execFile = util.promisify(child.exec);
        const childProcess = await execFile(this.generateBuildCommand());
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

        return this.generateCodeFromNode(tree as AstNode);
    }

    abstract generateCodeFromNode(astNode: AstNode): string;

    abstract generateProjectFile(): string;

    abstract generateProjectName(): string;

    abstract generateFileName(): string;

    abstract generateBuildCommand(): string;
}
