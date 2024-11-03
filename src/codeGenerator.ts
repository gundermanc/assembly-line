import { AstNode, CallNode, FloatNode, IntegerNode, NodeType, StringNode } from "./parser";
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

            case NodeType.IntegerNode:
                return `"${(node as IntegerNode).value}"`;

            case NodeType.FloatNode:
                return `"${(node as FloatNode).value}"`;
        }

        return undefined;
    }

    private definePlatformSymbols() {
        const logStringSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logS',
            platformName: 'System.Console.WriteLine',
            parameterTypes: ['string'],
            returnType: 'void'
        };
        this.symbols.defineSymbol(logStringSymbol);

        const logIntegerSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logI',
            platformName: 'System.Console.WriteLine',
            parameterTypes: ['i32'],
            returnType: 'void'
        };
        this.symbols.defineSymbol(logIntegerSymbol);

        const logFloatSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logF',
            platformName: 'System.Console.WriteLine',
            parameterTypes: ['f32'],
            returnType: 'void'
        };
        this.symbols.defineSymbol(logFloatSymbol);
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

            case NodeType.IntegerNode:
                return `"${(node as IntegerNode).value}"`;

            case NodeType.FloatNode:
                return `"${(node as FloatNode).value}"`;
        }

        return undefined;
    }

    private definePlatformSymbols() {
        const logStringSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logS',
            platformName: 'console.log',
            parameterTypes: ['string'],
            returnType: 'void'
        };
        this.symbols.defineSymbol(logStringSymbol);

        const logIntegerSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logI',
            platformName: 'console.log',
            parameterTypes: ['i32'],
            returnType: 'void'
        };
        this.symbols.defineSymbol(logIntegerSymbol);

        const logFloatSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logF',
            platformName: 'console.log',
            parameterTypes: ['f32'],
            returnType: 'void'
        };
        this.symbols.defineSymbol(logFloatSymbol);
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

            case NodeType.IntegerNode:
                return `"${(node as IntegerNode).value}"`;

            case NodeType.FloatNode:
                return `"${(node as FloatNode).value}"`;
        }

        return undefined;
    }

    private definePlatformSymbols() {
        const logStringSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logS',
            platformName: 'print',
            parameterTypes: ['string'],
            returnType: 'void'
        };
        this.symbols.defineSymbol(logStringSymbol);

        const logIntegerSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logI',
            platformName: 'print',
            parameterTypes: ['i32'],
            returnType: 'void'
        };
        this.symbols.defineSymbol(logIntegerSymbol);

        const logFloatSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logF',
            platformName: 'print',
            parameterTypes: ['f32'],
            returnType: 'void'
        };
        this.symbols.defineSymbol(logFloatSymbol);
    }
}
