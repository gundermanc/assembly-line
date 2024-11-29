import { AstNode, BinaryOperationNode, CallNode, isAstNode, NodeType } from "./parser";
import { PlatformFunctionDefinition, SymbolTable, SymbolType } from "./symbols";

type SemanticType = string | SemanticError;

export function isSemanticType(item: SemanticType | undefined): item is SemanticType {
    return (typeof item === "string");
}

export class SemanticModel {
    public readonly nodeTypes: Map<AstNode, SemanticType>;
    public readonly symbolTable: SymbolTable;

    constructor(nodeTypes: Map<AstNode, SemanticType>, symbolTable: SymbolTable) {
        this.nodeTypes = nodeTypes;
        this.symbolTable = symbolTable;
    }

    public hasError(): boolean {
        return this.nodeTypes
            .values()
            .find(value => !isSemanticType(value)) !== undefined;
    }

    public errors(): ReadonlySet<SemanticError> {
        return new Set(this.nodeTypes
            .values()
            .filter(value => !isSemanticType(value)));
    }
}

export function isSemanticModel(item: unknown): item is SemanticModel {
    return (item as SemanticModel).nodeTypes !== undefined;
}

export enum SemanticError {
    MismatchedParameterCount,
    MismatchedParameterType,
    UnknownFunctionType,
    UnexpectedNodeType,
    IncompatibleOperands
}

export function buildSemanticModel(root: AstNode, symbols: SymbolTable): SemanticModel {
    const visitor = new SemanticModelVisitor(root, symbols);

    visitor.visit();
    return new SemanticModel(visitor.nodeTypes, symbols);
}

export abstract class AstVisitor<T> {
    private readonly root: AstNode;

    constructor(root: AstNode) {
        this.root = root;
    }

    public visit(): T {
        switch (this.root.type) {
            case NodeType.CallNode:
                return this.visitCall(this.root as CallNode);
        }

        return this.unmatchedRule(this.root);
    }

    protected abstract visitCall(call: CallNode): T;

    protected abstract unmatchedRule(node: AstNode): T;

    protected typeFromNode(node: AstNode): string | undefined {
        switch (node.type) {
            case NodeType.StringNode:
                'string';
        }

        return undefined;
    }
}

class SemanticModelVisitor extends AstVisitor<SemanticType> {
    public readonly nodeTypes: Map<AstNode, SemanticType> = new Map();
    private readonly symbols: SymbolTable;

    constructor(root: AstNode, symbols: SymbolTable) {
        super(root);

        this.symbols = symbols;
    }

    protected visitCall(call: CallNode): SemanticType {
        const symbol = this.symbols.getSymbol(call.symbol);
        if (symbol?.symbolType != SymbolType.PlatformFunction) {
            this.nodeTypes.set(call, SemanticError.UnknownFunctionType);
        }

        const platformFunction = symbol as PlatformFunctionDefinition;
        if (platformFunction.parameterTypes.length != call.parameters.length) {
            this.nodeTypes.set(call, SemanticError.MismatchedParameterCount);
        }

        for (let i = 0; i < call.parameters.length; i++) {
            const parameterType = this.getExpressionType(call.parameters[i]);
            if (parameterType != platformFunction.parameterTypes[i]) {
                this.nodeTypes.set(call.parameters[i], SemanticError.MismatchedParameterType);
            }
        }

        if (this.nodeTypes.get(call) === undefined) {
            this.nodeTypes.set(call, platformFunction.returnType);
        }

        return platformFunction.returnType;
    }

    protected unmatchedRule(node: AstNode): SemanticType {
        this.nodeTypes.set(node, SemanticError.UnexpectedNodeType);
        return SemanticError.UnexpectedNodeType;
    }

    private getExpressionType(expressionNode: AstNode): SemanticType {
        switch (expressionNode.type) {
            case NodeType.StringNode:
                this.nodeTypes.set(expressionNode, 'string');
                return 'string';

            case NodeType.IntegerNode:
                this.nodeTypes.set(expressionNode, 'i32');
                return 'i32';

            case NodeType.FloatNode:
                this.nodeTypes.set(expressionNode, 'f32');
                return 'f32';

            case NodeType.BinaryOperation:
                const binaryOperationNode = expressionNode as BinaryOperationNode;
                if (binaryOperationNode && isAstNode(binaryOperationNode.left) && isAstNode(binaryOperationNode.right)) {
                    const left = this.getExpressionType(binaryOperationNode.left);
                    const right = this.getExpressionType(binaryOperationNode.right);

                    if (left !== right) {
                        this.nodeTypes.set(expressionNode, SemanticError.IncompatibleOperands);
                        return SemanticError.IncompatibleOperands;
                    }

                    this.nodeTypes.set(expressionNode, left);

                    return left;
                }
                break;
        }

        this.nodeTypes.set(expressionNode, SemanticError.UnexpectedNodeType);
        return SemanticError.UnexpectedNodeType;
    }
}
