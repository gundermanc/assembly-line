using System;
using System.IO;

namespace AssemblyLine.Compiler;

public abstract class VisitorBase
{
    public void VisitRootNode(INode node)
    {
        this.StartVisit();
        
        if (node.Type != NodeType.StatementList)
        {
            throw new InvalidDataException("Expected top level statements list.");
        }

        foreach (var statementNode in node.Children)
        {
            this.VisitStatementNode(statementNode);
        }

        this.EndVisit();
    }

    public abstract void StartVisit();

    public abstract void EndVisit();

    private void VisitStatementNode(INode statementNode)
    {
        switch (statementNode.Type)
        {
            case NodeType.ReturnStatement:
                this.VisitReturnStatementNode(statementNode);
                break;

            default:
                throw new InvalidOperationException("Unexpected statement kind");
        }
    }

    public abstract void VisitReturnStatementNode(INode statementNode);
}
