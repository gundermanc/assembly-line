namespace AssemblyLine.Compiler;

public readonly record struct Token<T>(TokenType Type, T? Value) : IToken;

public interface IToken
{
    TokenType Type { get; }

    Token<T> As<T>() => (Token<T>)this;
}
