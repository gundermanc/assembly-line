using System;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Text;

namespace AssemblyLine.Compiler;

public sealed class Tokenizer
{
    private readonly StreamReader streamReader;
    private IToken? current;
    private IToken? next;

    public Tokenizer(Stream stream)
    {
        this.streamReader = new StreamReader(stream ??
            throw new ArgumentNullException(nameof(stream)));

        this.MoveNext();
    }

    public IToken? GetNext()
    {
        this.MoveNext();

        return this.current;
    }

    public IToken? PeekNext()
    {
        return this.next;
    }

    private void MoveNext()
    {
        int c;

        do
        {
            c = this.streamReader.Read();
        }
        while (!TryParseCharacter(c));
    }

    private bool TryParseCharacter(int c)
    {
        this.current = this.next;

        switch (c)
        {
            case -1:
                this.next = null;
                return true;
            
            case ' ':
                return false;

            case '\t':
                throw new InvalidOperationException("Tabs are not allowed");

            case '+':
                this.next = new Token<object>(TokenType.PlusOperator, Value: null);
                return true;

            default:
                this.next = this.ParseKeywordNameOrLiteral(c);
                return true;
        }
    }

    private IToken ParseKeywordNameOrLiteral(int c)
    {
        if (this.TryMatchName(c, "return"))
        {
            return new Token<object>(TokenType.ReturnKeyword, Value: null);
        }
        else if (this.TryMatchIntegerLiteral(c, out var integerToken))
        {
            return integerToken;
        }

        throw new InvalidOperationException();
    }

    private bool TryMatchName(int c, string name)
    {
        if (c != -1 &&
            !char.IsLetter((char)c))
        {
            return false;
        }

        for (int i = 1; i < name.Length; i++)
        {
            c = this.streamReader.Read();
            if (c == -1)
            {
                throw new InvalidDataException("Unexpected end of file in keyword or name");
            }

            if (name[i] != c)
            {
                return false;
            }
        }

        return true;
    }

    private bool TryMatchIntegerLiteral(
        int c,
        [NotNullWhen(returnValue: true)] out IToken? integerToken)
    {
        if (c != -1 &&
            !char.IsDigit((char)c))
        {
            integerToken = default;
            return false;
        }

        // TODO: rewrite in terms of Span<char>.
        var builder = new StringBuilder();

        do
        {
            builder.Append(c);
            c = this.streamReader.Read();
        }
        while (char.IsDigit((char)c));

        integerToken = new Token<int>(TokenType.IntegerLiteral, Value: int.Parse(builder.ToString()));
        return true;
    }
}
