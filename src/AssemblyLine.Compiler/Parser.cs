using System;
using System.Collections.Generic;

namespace AssemblyLine.Compiler;

public sealed class Parser
{
    private readonly Tokenizer tokenizer;

    public Parser(Tokenizer tokenizer)
    {
        this.tokenizer = tokenizer ??
            throw new ArgumentNullException(nameof(tokenizer));
    }

    public INode Parse() => this.ParseTopLevelStatements();

    private INode ParseTopLevelStatements()
    {
        var token = this.tokenizer.PeekNext();
        if (token is null)
        {
            return new Node<object>(NodeType.StatementList, Value: null);
        }

        switch (token.Type)
        {
            case TokenType.ReturnKeyword:
                return this.ParseTopLevelReturn();

            default:
                throw new InvalidOperationException("Unknown top level statement");
        }
    }

    private INode ParseTopLevelReturn()
    {
        AssertTokenType(this.tokenizer.GetNext(), TokenType.ReturnKeyword);

        var node = new Node<object>(NodeType.ReturnStatement, Value: null);
        node.Children.Add(this.ParseExpression());

        AssertTokenType(this.tokenizer.GetNext(), TokenType.SemicolonOperator);

        return node;
    }

    private INode ParseExpression()
    {
        var integerToken = this.tokenizer.PeekNext();
        if (integerToken?.Type != TokenType.IntegerLiteral)
        {
            throw new InvalidOperationException("Uknown expression");
        }

        return new Node<int>(
            NodeType.IntegerLiteral,
            integerToken.As<int>().Value);
    }

    private void AssertTokenType(IToken? token, TokenType desiredTokenType)
    {
        if (token?.Type != desiredTokenType)
        {
            throw new InvalidOperationException("Unexpected token type");
        }
    }
}

public record Node<T>(NodeType Type, T? Value) : INode
{
    public List<INode> Children { get; } = new();
}

public interface INode
{
    List<INode> Children { get; }

    NodeType Type { get; }

    Node<T> As<T>() => (Node<T>)this;
}

public enum NodeType
{
    StatementList,
    ReturnStatement,
    IntegerLiteral
}
