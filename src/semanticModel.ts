import { isStringObject } from "util/types";
import { AstNode, BinaryOperationNode, CallNode, isAstNode, NodeType } from "./parser";
import { PlatformFunctionDefinition, SymbolTable, SymbolType } from "./symbols";

type SemanticModelResult = SemanticNode | SemanticError;

export interface SemanticNode {
    readonly returnType: string
}

export enum SemanticError {
    MismatchedParameterCount,
    MismatchedParameterType,
    UnknownFunctionType,
    UnexpectedNodeType,
    IncompatibleOperands
}

export function buildSemanticModel(root: AstNode, symbols: SymbolTable): SemanticModelResult {
    const visitor = new SemanticModelVisitor(root, symbols);

    return visitor.visit();
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

        return this.unmatchedRule();
    }

    protected abstract visitCall(call: CallNode): T;

    protected abstract unmatchedRule(): T;

    protected typeFromNode(node: AstNode): string | undefined {
        switch (node.type) {
            case NodeType.StringNode:
                'string';
        }

        return undefined;
    }
}

class SemanticModelVisitor extends AstVisitor<SemanticModelResult> {
    private readonly symbols: SymbolTable;

    constructor(root: AstNode, symbols: SymbolTable) {
        super(root);

        this.symbols = symbols;
    }

    protected visitCall(call: CallNode): SemanticModelResult {
        const symbol = this.symbols.getSymbol(call.symbol);
        if (symbol?.symbolType != SymbolType.PlatformFunction) {
            return SemanticError.UnknownFunctionType;
        }

        const platformFunction = symbol as PlatformFunctionDefinition;
        if (platformFunction.parameterTypes.length != call.parameters.length) {
            return SemanticError.MismatchedParameterCount;
        }

        for (let i = 0; i < call.parameters.length; i++) {
            const parameterType = this.getExpressionType(call.parameters[i]);
            if (parameterType != platformFunction.parameterTypes[i]) {

                // Make sure to propagate lower level errors up if the type
                // check fails due to a subtree check failing rather than just
                // a param check.
                return isStringObject(parameterType) ?
                    SemanticError.MismatchedParameterType :
                    parameterType;
            }
        }

        return { returnType: platformFunction.returnType };
    }

    protected unmatchedRule(): SemanticModelResult {
        return SemanticError.UnexpectedNodeType;
    }

    private getExpressionType(expressionNode: AstNode): string | SemanticError {
        switch (expressionNode.type) {
            case NodeType.StringNode:
                return 'string';

            case NodeType.IntegerNode:
                return 'i32';

            case NodeType.FloatNode:
                return 'f32';

            case NodeType.BinaryOperation:
                const binaryOperationNode = expressionNode as BinaryOperationNode;
                if (binaryOperationNode && isAstNode(binaryOperationNode.left) && isAstNode(binaryOperationNode.right)) {
                    const left = this.getExpressionType(binaryOperationNode.left);
                    const right = this.getExpressionType(binaryOperationNode.right);

                    if (left != right) {
                        return SemanticError.IncompatibleOperands;
                    }

                    return left;
                }
                break;
        }

        return SemanticError.UnexpectedNodeType;
    }
}
