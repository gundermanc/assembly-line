import { Lexeme, LexemeType, LexError } from "./lexer";

export type ParseResult = AstNode | ParseError | undefined;

export enum NodeType {
    CallNode,
    StringNode,
    IntegerNode,
    FloatNode,
    BooleanNode,
    BinaryOperation,
    UnaryOperation
};

export enum Operation {
    Add,
    Subtract,
    Multiply,
    Divide,
    And,
    Or,
    Not
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

export class UnaryOperationNode extends AstNode {
    public readonly operation: Operation;
    public readonly operand: ParseResult;

    constructor(operation: Operation, operand: AstNode) {
        super(NodeType.UnaryOperation);
        this.operation = operation;
        this.operand = operand;
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

export class BooleanNode extends AstNode {
    value: boolean;

    constructor(value: boolean) {
        super(NodeType.BooleanNode);

        this.value = value;
    }
}

export enum ParseError {
    ExpectedClosingParen,
    ExpectedOpeningParen,
    ExpectedExpression,
    MalformedFunctionCallExpression,
    UnrecognizedToken,
    ExpectedOperand
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

        if (lexemes.current()?.type === LexemeType.Comma) {
            lexemes.next();
        } else {
            break;
        }
    }

    return params;
}

function parseExpression(lexemes: LexemeIterator): ParseResult {
    return parseOrExpression(lexemes);
}

function parseOrExpression(lexemes: LexemeIterator): ParseResult | undefined {
    const left = parseAndExpression(lexemes);
    if (!left) {
        return undefined;
    }

    // Check for an operator. If none, we're done.
    const operator = lexemes.current();
    if (operator?.type !== LexemeType.Operator || operator.text !== '||') {
        return left;
    }

    // Consume the operator.
    lexemes.next();

    const right = parseOrExpression(lexemes);
    if (isAstNode(left) && isAstNode(right)) {
        return new BinaryOperationNode(Operation.Or, left, right);
    }

    return ParseError.ExpectedOperand;
}

function parseAndExpression(lexemes: LexemeIterator): ParseResult | undefined {
    const left = parseNotExpression(lexemes);
    if (!left) {
        return undefined;
    }

    // Check for an operator. If none, we're done.
    const operator = lexemes.current();
    if (operator?.type !== LexemeType.Operator || operator.text !== '&&') {
        return left;
    }

    // Consume the operator.
    lexemes.next();

    const right = parseAndExpression(lexemes);
    if (isAstNode(left) && isAstNode(right)) {
        return new BinaryOperationNode(Operation.And, left, right);
    }

    return ParseError.ExpectedOperand;
}

function parseNotExpression(lexemes: LexemeIterator): ParseResult | undefined {
    const operator = lexemes.current();
    if (operator?.type === LexemeType.Operator && operator.text === '!') {
        // Consume the operator.
        lexemes.next();

        const operand = parseNotExpression(lexemes);
        if (isAstNode(operand)) {
            return new UnaryOperationNode(Operation.Not, operand);
        }

        return ParseError.ExpectedOperand;
    }

    // If no NOT operator, continue to arithmetic expressions
    return parseArithmeticExpression(lexemes);
}

function parseArithmeticExpression(lexemes: LexemeIterator): ParseResult | undefined {
    return parseAddSubtractExpression(lexemes);
}

function parseMultiplyDivideExpressions(lexemes: LexemeIterator): ParseResult | undefined {

    const left = parseLiteralExpression(lexemes);

     // Check for an operator. If none, we're done.
     const operator = lexemes.current();
     if (operator?.type !== LexemeType.Operator) {
         return left;
     }

    let operation: Operation;
    switch (operator.text) {
        case '*':
            operation = Operation.Multiply;
            break;
        case '/':
            operation = Operation.Divide;
            break;
        default:
            return left;
    }

    // Consume the operator.
    lexemes.next();

    const right = parseMultiplyDivideExpressions(lexemes);
    if (isAstNode(left) && isAstNode(right)) {
        return new BinaryOperationNode(operation, left, right)
    }

    return ParseError.ExpectedOperand;
}

function parseAddSubtractExpression(lexemes: LexemeIterator): ParseResult | undefined {

    // Parse left expression.
    const left = parseMultiplyDivideExpressions(lexemes);

    // Check for an operator. If none, we're done.
    const operator = lexemes.current();
    if (operator?.type !== LexemeType.Operator) {
        return left;
    }

    // Found one, parse it.
    let operation: Operation;
    switch (operator.text) {
        case '+':
            operation = Operation.Add;
            break;
        case '-':
            operation = Operation.Subtract;
            break;
        default:
            return left;
    }

    // Consume the operator.
    lexemes.next();

    const right = parseAddSubtractExpression(lexemes);
    if (isAstNode(left) && isAstNode(right)) {
        return new BinaryOperationNode(operation, left, right);
    }

    return ParseError.ExpectedOperand;
}

function parseLiteralExpression(lexemes: LexemeIterator): ParseResult {
    const lexeme = lexemes.current();

    lexemes.next();

    switch (lexeme?.type) {
        case LexemeType.String:
            const text = lexeme?.text;
            return text ? new StringNode(text) : ParseError.UnrecognizedToken;

        case LexemeType.Integer:
            const intValue = lexeme?.text;
            return intValue ? new IntegerNode(Number(intValue)) : ParseError.UnrecognizedToken;

        case LexemeType.Float:
            const floatValue = lexeme?.text;
            return floatValue ? new FloatNode(Number(floatValue)) : ParseError.UnrecognizedToken;

        case LexemeType.Keyword:
            const keyword = lexeme?.text;
            if (keyword === 'true') {
                return new BooleanNode(true);
            } else if (keyword === 'false') {
                return new BooleanNode(false);
            }
            break;
    }

    return ParseError.ExpectedExpression;
}
