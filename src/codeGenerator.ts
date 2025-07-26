import { AstNode, BinaryOperationNode, BooleanNode, CallNode, FloatNode, IntegerNode, isAstNode, NodeType, Operation, StringNode, UnaryOperationNode } from "./parser";
import { AstVisitor, isSemanticType, SemanticModel } from "./semanticModel";
import { PlatformFunctionDefinition, SymbolTable, SymbolType } from "./symbols";

export enum CodeGeneratorError {
    None,
    UnknownError,
}

abstract class CodeGeneratorBase extends AstVisitor<CodeGeneratorError> {
    public readonly symbols: SymbolTable;
    public readonly semanticModel: SemanticModel;

    constructor(root: AstNode, semanticModel: SemanticModel) {
        super(root);

        this.semanticModel = semanticModel;
        this.symbols = semanticModel.symbolTable;
    }

    protected nodeToCode(node: AstNode): string | undefined {
        switch (node.type) {
            case NodeType.StringNode:
                return `"${(node as StringNode).text}"`;

            case NodeType.IntegerNode:
                return `${(node as IntegerNode).value}`;

            case NodeType.FloatNode:
                return `${(node as FloatNode).value}`;

            case NodeType.BooleanNode:
                return (node as BooleanNode).value ? 'true' : 'false';

            case NodeType.BinaryOperation:
                return this.operatorNodeToCode(node);

            case NodeType.UnaryOperation:
                return this.unaryOperatorNodeToCode(node);
        }

        return undefined;
    }

    protected unaryOperatorNodeToCode(node: AstNode): string | undefined {
        const operatorNode = node as UnaryOperationNode;

        let operation: string | undefined;

        switch (operatorNode.operation) {
            case Operation.Not:
                operation = '!';
                break;
        }

        if (operation && isAstNode(operatorNode.operand)) {
            const operand = this.nodeToCode(operatorNode.operand);
            return `${operation}${operand}`;
        }

        return undefined;
    }

    protected operatorNodeToCode(node: AstNode): string | undefined {
        const operatorNode = node as BinaryOperationNode;

        let operation: string | undefined;

        switch (operatorNode.operation) {
            case Operation.Add:
                operation = '+';
                break;
            case Operation.Subtract:
                operation = '-';
                break;
            case Operation.Multiply:
                operation = '*';
                break;
            case Operation.Divide:
                operation = '/';
                break;
            case Operation.And:
                operation = '&&';
                break;
            case Operation.Or:
                operation = '||';
                break;
        }

        if (operation && isAstNode(operatorNode.left) && isAstNode(operatorNode.right)) {
            const left = this.nodeToCode(operatorNode.left);
            const right = this.nodeToCode(operatorNode.right);

            return `${left} ${operation} ${right}`;
        }

        return undefined;
    }
}

export class CSharpCodeGenerator extends CodeGeneratorBase {

    public code: string = "";

    constructor(root: AstNode, semanticModel: SemanticModel) {
        super(root, semanticModel);
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

    public static definePlatformSymbols(symbols: SymbolTable) {
        const logStringSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logS',
            platformName: 'System.Console.WriteLine',
            parameterTypes: ['string'],
            returnType: 'void'
        };
        symbols.defineSymbol(logStringSymbol);

        const logIntegerSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logI',
            platformName: 'System.Console.WriteLine',
            parameterTypes: ['i32'],
            returnType: 'void'
        };
        symbols.defineSymbol(logIntegerSymbol);

        const logFloatSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logF',
            platformName: 'System.Console.WriteLine',
            parameterTypes: ['f32'],
            returnType: 'void'
        };
        symbols.defineSymbol(logFloatSymbol);

        const logBooleanSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logB',
            platformName: 'System.Console.WriteLine',
            parameterTypes: ['bool'],
            returnType: 'void'
        };
        symbols.defineSymbol(logBooleanSymbol);
    }
}

export class TypeScriptCodeGenerator extends CodeGeneratorBase {

    public code: string = "";

    constructor(root: AstNode, semanticModel: SemanticModel) {
        super(root, semanticModel);
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

    protected operatorNodeToCode(node: AstNode): string | undefined {
        const operatorNode = node as BinaryOperationNode;

        let operation: string | undefined;

        switch (operatorNode.operation) {
            case Operation.Add:
                operation = '+';
                break;
            case Operation.Subtract:
                operation = '-';
                break;
            case Operation.Multiply:
                operation = '*';
                break;
            case Operation.Divide:
                operation = '/';
                break;
            case Operation.And:
                operation = '&&';
                break;
            case Operation.Or:
                operation = '||';
                break;
        }

        if (operation && isAstNode(operatorNode.left) && isAstNode(operatorNode.right)) {
            const left = this.nodeToCode(operatorNode.left);
            const right = this.nodeToCode(operatorNode.right);

            let code = `${left} ${operation} ${right}`;

            // TypeScript has no native integer type so we need to simulate it when
            // doing division by doing a math.trunc() on the result of division
            // to drop the decimal.
            const operationType = this.semanticModel.nodeTypes.get(operatorNode);
            if (isSemanticType(operationType) && operationType === 'i32' && operatorNode.operation == Operation.Divide) {
                code = `Math.trunc(${code})`;
            }

            return code;
        }

        return undefined;
    }

    protected unmatchedRule(): CodeGeneratorError {
        return CodeGeneratorError.UnknownError;
    }

    public static definePlatformSymbols(symbols: SymbolTable) {
        const logStringSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logS',
            platformName: 'console.log',
            parameterTypes: ['string'],
            returnType: 'void'
        };
        symbols.defineSymbol(logStringSymbol);

        const logIntegerSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logI',
            platformName: 'console.log',
            parameterTypes: ['i32'],
            returnType: 'void'
        };
        symbols.defineSymbol(logIntegerSymbol);

        const logFloatSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logF',
            platformName: 'console.log',
            parameterTypes: ['f32'],
            returnType: 'void'
        };
        symbols.defineSymbol(logFloatSymbol);

        const logBooleanSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logB',
            platformName: 'console.log',
            parameterTypes: ['bool'],
            returnType: 'void'
        };
        symbols.defineSymbol(logBooleanSymbol);
    }
}

export class PythonCodeGenerator extends CodeGeneratorBase {

    // Need to import math for math.trunc() function.
    public code: string = 'import math\n';

    constructor(root: AstNode, semanticModel: SemanticModel) {
        super(root, semanticModel);
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

    protected nodeToCode(node: AstNode): string | undefined {
        // Override for Python-specific boolean literals
        if (node.type === NodeType.BooleanNode) {
            return (node as BooleanNode).value ? 'True' : 'False';
        }
        
        // For all other nodes, use the base implementation
        return super.nodeToCode(node);
    }

    protected unaryOperatorNodeToCode(node: AstNode): string | undefined {
        const operatorNode = node as UnaryOperationNode;

        let operation: string | undefined;

        switch (operatorNode.operation) {
            case Operation.Not:
                operation = 'not ';  // Note the space after 'not'
                break;
        }

        if (operation && isAstNode(operatorNode.operand)) {
            const operand = this.nodeToCode(operatorNode.operand);
            return `${operation}${operand}`;
        }

        return undefined;
    }

    protected operatorNodeToCode(node: AstNode): string | undefined {
        const operatorNode = node as BinaryOperationNode;

        let operation: string | undefined;

        switch (operatorNode.operation) {
            case Operation.Add:
                operation = '+';
                break;
            case Operation.Subtract:
                operation = '-';
                break;
            case Operation.Multiply:
                operation = '*';
                break;
            case Operation.Divide:
                operation = '/';
                break;
            case Operation.And:
                operation = 'and';
                break;
            case Operation.Or:
                operation = 'or';
                break;
        }

        if (operation && isAstNode(operatorNode.left) && isAstNode(operatorNode.right)) {
            const left = this.nodeToCode(operatorNode.left);
            const right = this.nodeToCode(operatorNode.right);

            let code = `${left} ${operation} ${right}`;

            // Python has no native integer type so we need to simulate it when
            // doing division by doing a Math.floor() or Math.ceiling() as needed.
            const operationType = this.semanticModel.nodeTypes.get(operatorNode);
            if (isSemanticType(operationType) && operationType === 'i32' && operatorNode.operation == Operation.Divide) {
                code = `math.trunc(${code})`;
            }

            return code;
        }

        return undefined;
    }

    public static definePlatformSymbols(symbols: SymbolTable) {
        const logStringSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logS',
            platformName: 'print',
            parameterTypes: ['string'],
            returnType: 'void'
        };
        symbols.defineSymbol(logStringSymbol);

        const logIntegerSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logI',
            platformName: 'print',
            parameterTypes: ['i32'],
            returnType: 'void'
        };
        symbols.defineSymbol(logIntegerSymbol);

        const logFloatSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logF',
            platformName: 'print',
            parameterTypes: ['f32'],
            returnType: 'void'
        };
        symbols.defineSymbol(logFloatSymbol);

        const logBooleanSymbol: PlatformFunctionDefinition = { 
            symbolType: SymbolType.PlatformFunction,
            name: 'logB',
            platformName: 'print',
            parameterTypes: ['bool'],
            returnType: 'void'
        };
        symbols.defineSymbol(logBooleanSymbol);
    }
}
