using System.IO;
using Xunit;

namespace AssemblyLine.Compiler.Tests;

public class TokenizerTests
{
    [Fact]
    public void Tokenizer_Empty()
    {
        var tokenizer = new Tokenizer(CreateStreamFromString(string.Empty));

        Assert.Null(tokenizer.PeekNext());
        Assert.Null(tokenizer.GetNext());

        Assert.Null(tokenizer.PeekNext());
        Assert.Null(tokenizer.GetNext());
    }

    [Fact]
    public void Tokenizer_SimpleReturnValue_WithWhitespace()
    {
        var tokenizer = new Tokenizer(CreateStreamFromString("return 3 + 4;"));

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
        var tokenizer = new Tokenizer(CreateStreamFromString("return 3+4;"));

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

    private static Stream CreateStreamFromString(string value)
    {
        var memoryStream = new MemoryStream();
        
        var writer = new StreamWriter(memoryStream);
        writer.Write(value);
        writer.Flush();

        memoryStream.Position = 0;

        return memoryStream;
    }
}