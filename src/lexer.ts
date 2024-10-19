export enum LexemeType {
    String
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

        const c = this.enumeratorString.charAt(this.index);
        this.index++;
        return c;
    }

    peek(): string | undefined {
        const nextIndex = this.index + 1;
        return nextIndex >= this.enumeratorString.length ?
            undefined :
            this.enumeratorString.charAt(nextIndex);
    }

    startSegment(): void {
        this.segmentStart = this.index;
    }

    endSegment(): string {
        if (this.segmentStart < 0 ||
            this.segmentStart >= this.enumeratorString.length) {
            throw new Error('Not in segment');
        }

        const segment = this.enumeratorString.substring(this.segmentStart, this.index);
        this.segmentStart = -1;

        return segment;
    }
}

export function* lexCode(enumerator: StringEnumerator): IterableIterator<Lexeme | LexError> {
    while (true) {
        const c = enumerator.next();
        switch (c) {
            case '"':
                yield lexString(enumerator);

            case undefined:
                return;
        }
    }
}

function lexString(enumerator: StringEnumerator): Lexeme | LexError {
    if (enumerator.peek() != '"') {
        return LexError.ExpectedClosingQuote;
    }

    enumerator.startSegment();

    while (true) {
        let c = enumerator.next();
        if (!c) {
            return LexError.ExpectedClosingQuote;
        } else if (c == '"') {
            break;
        }
    }

    return { type: LexemeType.String, text: enumerator.endSegment() };
}
