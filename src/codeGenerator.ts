import { AstNode, CallNode, NodeType, StringNode } from "./parser";
import { AstVisitor } from "./semanticModel";
import { PlatformFunctionDefinition, SymbolTable, SymbolType } from "./symbols";

export enum CodeGeneratorError {
    None,
    UnknownError,
}

abstract class CodeGeneratorBase extends AstVisitor<CodeGeneratorError> {
    public symbols: SymbolTable;

    constructor(root: AstNode) {
        super(root);

        this.symbols = new SymbolTable();
    }
}

export class CSharpCodeGenerator extends CodeGeneratorBase {

    public code: string = "";

    constructor(root: AstNode) {
        super(root);

        this.definePlatformSymbols();
    }

    protected visitCall(call: CallNode): CodeGeneratorError {
        const symbol = this.symbols.getSymbol(call.symbol);

        const platformFunction = symbol as PlatformFunctionDefinition;
        if (!(platformFunction)?.name) {
            return CodeGeneratorError.UnknownError;
        }

        const params = call.parameters.map(param => this.nodeToCode(param));
        const joinedParams = params.join(',');

        this.code += `${(symbol as PlatformFunctionDefinition).platformName}(${joinedParams});\n`;

        return CodeGeneratorError.None;
    }

    protected unmatchedRule(): CodeGeneratorError {
        return CodeGeneratorError.UnknownError;
    }

    private nodeToCode(node: AstNode): string | undefined {
        switch (node.type) {
            case NodeType.StringNode:
                return `"${(node as StringNode).text}"`;
        }

        return undefined;
    }

    private definePlatformSymbols() {
        const symbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'log',
            platformName: 'System.Console.WriteLine',
            parameterTypes: ['string'],
            returnType: 'void'
        };

        this.symbols.defineSymbol(symbol);
    }
}

export class TypeScriptCodeGenerator extends CodeGeneratorBase {

    public code: string = "";

    constructor(root: AstNode) {
        super(root);

        this.definePlatformSymbols();
    }

    protected visitCall(call: CallNode): CodeGeneratorError {
        const symbol = this.symbols.getSymbol(call.symbol);

        const platformFunction = symbol as PlatformFunctionDefinition;
        if (!(platformFunction)?.name) {
            return CodeGeneratorError.UnknownError;
        }

        const params = call.parameters.map(param => this.nodeToCode(param));
        const joinedParams = params.join(',');

        this.code += `${(symbol as PlatformFunctionDefinition).platformName}(${joinedParams});\n`;

        return CodeGeneratorError.None;
    }

    protected unmatchedRule(): CodeGeneratorError {
        return CodeGeneratorError.UnknownError;
    }

    private nodeToCode(node: AstNode): string | undefined {
        switch (node.type) {
            case NodeType.StringNode:
                return `"${(node as StringNode).text}"`;
        }

        return undefined;
    }

    private definePlatformSymbols() {
        const symbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'log',
            platformName: 'console.log',
            parameterTypes: ['string'],
            returnType: 'void'
        };

        this.symbols.defineSymbol(symbol);
    }
}

export class PythonCodeGenerator extends CodeGeneratorBase {

    public code: string = "";

    constructor(root: AstNode) {
        super(root);

        this.definePlatformSymbols();
    }

    protected visitCall(call: CallNode): CodeGeneratorError {
        const symbol = this.symbols.getSymbol(call.symbol);

        const platformFunction = symbol as PlatformFunctionDefinition;
        if (!(platformFunction)?.name) {
            return CodeGeneratorError.UnknownError;
        }

        const params = call.parameters.map(param => this.nodeToCode(param));
        const joinedParams = params.join(',');

        this.code += `${(symbol as PlatformFunctionDefinition).platformName}(${joinedParams});\n`;

        return CodeGeneratorError.None;
    }

    protected unmatchedRule(): CodeGeneratorError {
        return CodeGeneratorError.UnknownError;
    }

    private nodeToCode(node: AstNode): string | undefined {
        switch (node.type) {
            case NodeType.StringNode:
                return `"${(node as StringNode).text}"`;
        }

        return undefined;
    }

    private definePlatformSymbols() {
        const symbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'log',
            platformName: 'print',
            parameterTypes: ['string'],
            returnType: 'void'
        };

        this.symbols.defineSymbol(symbol);
    }
}
