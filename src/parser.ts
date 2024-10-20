import { Lexeme, LexemeType, LexError } from "./lexer";

export type ParseResult = AstNode | ParseError | undefined;

export interface AstNode {

}

export interface CallNode extends AstNode {
    symbol: string,
    parameters: AstNode[]
}

export interface StringNode extends AstNode {
    text: string
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
        const result: AstNode = { symbol: symbolName };
        return result;
    }

    const parameters = parseParamList(lexemes);

    if (lexemes.current()?.type !== LexemeType.RightParen) {
        return ParseError.ExpectedClosingParen;
    }

    lexemes.next();

    const result: CallNode | ParseError = symbolName && parameters ?
        { symbol: symbolName, parameters: parameters } :
        ParseError.MalformedFunctionCallExpression;

    return result;
}

function parseParamList(lexemes: LexemeIterator): AstNode[] | undefined {
    let params: AstNode[] = [];

    while (true) {
        const param = parseExpression(lexemes);
        if (!param) {
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
    switch (lexemes.current()?.type) {
        case LexemeType.String:
            return { text: lexemes.current()?.text };
    }

    return ParseError.ExpectedExpression;
}
