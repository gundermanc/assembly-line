export enum LexemeType {
    Comma,
    Identifier,
    LeftParen,
    RightParen,
    String,
    Integer,
    Float,
    Operator
}

export interface Lexeme {
    type: LexemeType,
    text: string | undefined
}

export enum LexError {
    ExpectedClosingQuote
}

export class StringEnumerator {
    private enumeratorString: string;
    private index: number = 0;
    private segmentStart: number = -1;

    constructor(enumeratorString: string) {
        this.enumeratorString = enumeratorString;
    }

    next(): string | undefined {
        if (this.index >= this.enumeratorString.length) {
            return undefined;
        }

        const c = this.current();
        this.index++;
        return c;
    }

    peek(): string | undefined {
        const nextIndex = this.index + 1;
        return nextIndex >= this.enumeratorString.length ?
            undefined :
            this.enumeratorString.charAt(nextIndex);
    }

    current(): string | undefined {
        return this.index < this.enumeratorString.length ?
            this.enumeratorString.charAt(this.index) :
            undefined;
    }

    startSegment(): void {
        this.segmentStart = this.index;
    }

    endSegment(): string {
        if (this.segmentStart < 0 ||
            this.segmentStart > this.enumeratorString.length) {
            throw new Error('Not in segment');
        }

        const segment = this.enumeratorString.substring(this.segmentStart, this.index);
        this.segmentStart = -1;

        return segment;
    }
}

export function* lexCode(enumerator: StringEnumerator): IterableIterator<Lexeme | LexError> {
    let c = undefined;

    while (true) {
        c = enumerator.current();
        switch (c) {
            case ',':
                yield { type: LexemeType.Comma, text: undefined };
                c = enumerator.next();
                break;
            case '(':
                yield { type: LexemeType.LeftParen, text: undefined };
                c = enumerator.next();
                break;
            case ')':
                yield { type: LexemeType.RightParen, text: undefined };
                c = enumerator.next();
                break;
            case '"':
                let str = lexString(enumerator);
                if (str) {
                    yield str;
                }
                break;
            case '+':
                yield { type: LexemeType.Operator, text: '+' };
                c = enumerator.next();
                break;
            case '-':
                yield { type: LexemeType.Operator, text: '-' };
                c = enumerator.next();
                break;
            case undefined:
                return;
            default:
                if (isNumeric(c)) {
                    let id = lexNumber(enumerator);
                    if (id) {
                        yield id;
                    }
                } else if (isAlphaNumeric(c)) {
                    let id = lexIdentifier(enumerator);
                    if (id) {
                        yield id;
                    }
                } else {
                    c = enumerator.next();
                }
                break;
        }
    }
}

function lexIdentifier(enumerator: StringEnumerator): Lexeme | LexError | undefined {
    enumerator.startSegment();

    while (true) {
        let c = enumerator.current();
        if (c && isAlphaNumeric(c)) {
            enumerator.next();
        } else {
            break;
        }
    }

    const segment = enumerator.endSegment();

    return segment.length > 0 ?
        { type: LexemeType.Identifier, text: segment.substring(0, segment.length) } :
        undefined;
}

function lexNumber(enumerator: StringEnumerator): Lexeme | LexError | undefined {
    enumerator.startSegment();

    var isFloat = false;

    while (true) {
        let c = enumerator.current();
        if (c && isNumeric(c)) {
            enumerator.next();
        } else if (c == '.') {
            isFloat = true;
            enumerator.next();
        } else {
            break;
        }
    }

    const segment = enumerator.endSegment();

    return segment.length > 0 ?
        {type: isFloat ? LexemeType.Float : LexemeType.Integer, text: segment.substring(0, segment.length) } :
        undefined;
}

function lexString(enumerator: StringEnumerator): Lexeme | LexError | undefined {
    enumerator.next();
    enumerator.startSegment();

    while (true) {
        let c = enumerator.next();
        if (!c) {
            return LexError.ExpectedClosingQuote;
        } else if (c === '"') {
            break;
        }
    }

    const segment = enumerator.endSegment();

    return segment.length > 0 ?
        { type: LexemeType.String, text: segment.substring(0, segment.length - 1) } :
        undefined;
}

function isAlphaNumeric(str: string): boolean {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }

    return true;
}

function isNumeric(str: string): boolean {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58)) {// numeric (0-9)
            return false;
        }
    }

    return true;
}
