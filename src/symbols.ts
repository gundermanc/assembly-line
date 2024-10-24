export enum SymbolType {
    PlatformFunction
}

export abstract class SymbolDefinition {
    public readonly name: string;
    public readonly symbolType: SymbolType;

    constructor(name: string, symbolType: SymbolType) {
        this.name = name;
        this.symbolType = symbolType;
    }
}

export class PlatformFunctionDefinition extends SymbolDefinition {
    public readonly platformName: string;
    public readonly parameterTypes: string[]
    public readonly returnType: string

    constructor(name: string, platformName: string, parameterTypes: string[], returnType: string) {
        super(name, SymbolType.PlatformFunction);

        this.platformName = platformName;
        this.parameterTypes = parameterTypes;
        this.returnType = returnType;
    }
}

export class SymbolTable {
    private readonly symbols: Map<string, SymbolDefinition>;

    constructor() {
        this.symbols = new Map();
    }

    defineSymbol(symbol: SymbolDefinition): void {
        this.symbols.set(symbol.name, symbol);
    }

    getSymbol(name: string): SymbolDefinition | undefined {
        return this.symbols.get(name);
    }
}
