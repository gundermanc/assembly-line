import { Lexeme, LexemeType, LexError } from "./lexer";

export type ParseResult = AstNode | ParseError | undefined;

export enum NodeType {
    CallNode,
    StringNode,
    IntegerNode,
    FloatNode,
    BinaryOperation
};

export enum Operation {
    Add,
}

export abstract class AstNode {
    public readonly type: NodeType;

    constructor(type: NodeType) {
        this.type = type;
    }
}

export function isAstNode(item: unknown): item is AstNode {
    return (item as AstNode).type !== undefined;
}

export class BinaryOperationNode extends AstNode {
    public readonly operation: Operation;
    public readonly left: ParseResult;
    public readonly right: ParseResult;

    constructor(operation: Operation, left: AstNode, right: AstNode) {
        super(NodeType.BinaryOperation);
        this.operation = operation;
        this.left = left;
        this.right = right;
    }
}

export class CallNode extends AstNode {
    symbol: string;
    parameters: AstNode[];

    constructor(symbol: string, parameters: AstNode[]) {
        super(NodeType.CallNode);

        this.symbol = symbol;
        this.parameters = parameters;
    }
}

export class StringNode extends AstNode {
    text: string;

    constructor(text: string) {
        super(NodeType.StringNode);

        this.text = text;
    }
}

export class IntegerNode extends AstNode {
    value: number;

    constructor(value: number) {
        super(NodeType.IntegerNode);

        this.value = value;
    }
}

export class FloatNode extends AstNode {
    value: number;

    constructor(value: number) {
        super(NodeType.FloatNode);

        this.value = value;
    }
}

export enum ParseError {
    ExpectedClosingParen,
    ExpectedOpeningParen,
    ExpectedExpression,
    MalformedFunctionCallExpression,
    UnrecognizedToken
}

class LexemeIterator {
    private readonly lexemes: IterableIterator<Lexeme | LexError>;
    private currentValue: Lexeme | undefined;
    private nextValue: Lexeme | undefined;

    constructor(lexemes: IterableIterator<Lexeme | LexError>) {
        this.lexemes = lexemes;

        this.advance();
        this.advance();
    }

    peek(): Lexeme | undefined {
        return this.nextValue;
    }

    current(): Lexeme | undefined {
        return this.currentValue;
    }

    next(): Lexeme | undefined {
        this.advance();
        return this.current();
    }

    private advance() {
        let result = this.lexemes.next();

        this.currentValue = this.nextValue;
        this.nextValue = result.value;
    }
}

export function parse(lexemes: IterableIterator<Lexeme | LexError>): AstNode | ParseError | undefined {
    let iterator = new LexemeIterator(lexemes);
    let root = undefined;

    switch (iterator.current()?.type) {
        case LexemeType.Identifier:
            root = parseIdentifierExpression(iterator);
    }

    if (iterator.next() !== undefined) {
        return ParseError.UnrecognizedToken;
    }

    return root;
}

function parseIdentifierExpression(lexemes: LexemeIterator): ParseResult {
    const symbolName = lexemes.current()?.text;

    if (lexemes.next()?.type !== LexemeType.LeftParen) {
        return ParseError.ExpectedOpeningParen;
    }

    // Bail if there are no parameters.
    if (lexemes.next()?.type === LexemeType.RightParen) {
        return symbolName ?
            new CallNode(symbolName, []) :
            ParseError.MalformedFunctionCallExpression;
    }

    const parameters = parseParamList(lexemes);

    if (lexemes.current()?.type !== LexemeType.RightParen) {
        return ParseError.ExpectedClosingParen;
    }

    lexemes.next();

    return symbolName && parameters ?
        new CallNode(symbolName, parameters) :
        ParseError.MalformedFunctionCallExpression;
}

function parseParamList(lexemes: LexemeIterator): AstNode[] | undefined {
    let params: AstNode[] = [];

    while (true) {
        const param = parseExpression(lexemes);
        if (!isAstNode(param)) {
            // TODO: propagate error up.
            return undefined;
        }

        params.push(param);

        if (lexemes.next()?.type === LexemeType.Comma) {
            lexemes.next();
        } else {
            break;
        }
    }

    return params;
}

function parseExpression(lexemes: LexemeIterator): ParseResult {
    const additionOperation = tryParseOperatorExpression(lexemes);
    if (additionOperation) {
        return additionOperation;
    }

    return parseLiteralExpression(lexemes);
}

function tryParseOperatorExpression(lexemes: LexemeIterator): ParseResult | undefined {
    const operator = lexemes.peek();

    let operation: Operation | undefined = undefined;
    if (operator?.type == LexemeType.Operator) {
        switch (operator.text) {
            case "+":
                operation = Operation.Add;
                break;
        }
    }

    if (operation !== undefined) {
        const left = parseLiteralExpression(lexemes);
        if (!isAstNode(left)) {
            return left;
        }

        lexemes.next();
        lexemes.next();

        const right = parseExpression(lexemes);
        if (!isAstNode(right)) {
            return right;
        }

        return new BinaryOperationNode(Operation.Add, left, right)
    }

    // Not applicable.
    return undefined;
}

function parseLiteralExpression(lexemes: LexemeIterator): ParseResult {
    switch (lexemes.current()?.type) {
        case LexemeType.String:
            const text = lexemes.current()?.text;
            return text ? new StringNode(text) : ParseError.UnrecognizedToken;

        case LexemeType.Integer:
            const intValue = lexemes.current()?.text;
            return intValue ? new IntegerNode(Number(intValue)) : ParseError.UnrecognizedToken;

        case LexemeType.Float:
            const floatValue = lexemes.current()?.text;
            return floatValue ? new FloatNode(Number(floatValue)) : ParseError.UnrecognizedToken;
    }

    return ParseError.ExpectedExpression;
}
