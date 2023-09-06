using Xunit;

namespace AssemblyLine.Compiler.Tests;

public class TokenizerTests
{
    [Fact]
    public void Tokenizer_Empty()
    {
        var tokenizer = new Tokenizer(string.Empty.ToStream());

        Assert.Null(tokenizer.PeekNext());
        Assert.Null(tokenizer.GetNext());

        Assert.Null(tokenizer.PeekNext());
        Assert.Null(tokenizer.GetNext());
    }

    [Fact]
    public void Tokenizer_SimpleReturnValue_WithWhitespace()
    {
        var tokenizer = new Tokenizer("return 3 + 4;".ToStream());

        Assert.Equal(TokenType.ReturnKeyword, tokenizer.PeekNext()?.Type);
        Assert.Null(tokenizer.PeekNext()?.As<object>().Value);
        Assert.Equal(TokenType.ReturnKeyword, tokenizer.GetNext()?.Type);

        Assert.Equal(TokenType.IntegerLiteral, tokenizer.PeekNext()?.Type);
        Assert.Equal(3, tokenizer.PeekNext()?.As<int>().Value);
        Assert.Equal(TokenType.IntegerLiteral, tokenizer.GetNext()?.Type);

        Assert.Equal(TokenType.PlusOperator, tokenizer.PeekNext()?.Type);
        Assert.Null(tokenizer.PeekNext()?.As<object>().Value);
        Assert.Equal(TokenType.PlusOperator, tokenizer.GetNext()?.Type);

        Assert.Equal(TokenType.IntegerLiteral, tokenizer.PeekNext()?.Type);
        Assert.Equal(4, tokenizer.PeekNext()?.As<int>().Value);
        Assert.Equal(TokenType.IntegerLiteral, tokenizer.GetNext()?.Type);
    }

    // TODO: not quite right.
    //[Fact]
    public void Tokenizer_SimpleReturnValue_WithoutWhitespace()
    {
        var tokenizer = new Tokenizer("return 3+4;".ToStream());

        Assert.Equal(TokenType.ReturnKeyword, tokenizer.PeekNext()?.Type);
        Assert.Null(tokenizer.PeekNext()?.As<object>().Value);
        Assert.Equal(TokenType.ReturnKeyword, tokenizer.GetNext()?.Type);

        Assert.Equal(TokenType.IntegerLiteral, tokenizer.PeekNext()?.Type);
        Assert.Equal(3, tokenizer.PeekNext()?.As<int>().Value);
        Assert.Equal(TokenType.IntegerLiteral, tokenizer.GetNext()?.Type);

        Assert.Equal(TokenType.PlusOperator, tokenizer.PeekNext()?.Type);
        Assert.Null(tokenizer.PeekNext()?.As<object>().Value);
        Assert.Equal(TokenType.PlusOperator, tokenizer.GetNext()?.Type);

        Assert.Equal(TokenType.IntegerLiteral, tokenizer.PeekNext()?.Type);
        Assert.Equal(4, tokenizer.PeekNext()?.As<int>().Value);
        Assert.Equal(TokenType.IntegerLiteral, tokenizer.GetNext()?.Type);
    }
}
