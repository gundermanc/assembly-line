using System;
using System.IO;

namespace AssemblyLine.Compiler.Backendss;

public sealed class CSharpBackend : BackendBase
{
    private readonly StreamWriter streamWriter;

    public CSharpBackend(Stream stream)
    {
        this.streamWriter = new StreamWriter(stream ??
            throw new ArgumentNullException(nameof(stream)));
    }

    public override void EndVisit()
    {
        this.streamWriter.Flush();
    }

    public override void StartVisit()
    {
        this.streamWriter.WriteLine("// Generated by Assembly Line Transpiler");
        this.streamWriter.WriteLine();
    }

    public override void VisitReturnStatementNode(INode returnStatementNode)
    {
        this.streamWriter.Write(CSharpSyntax.ReturnKeyword);
        this.streamWriter.Write(' ');
        this.streamWriter.Write(returnStatementNode.Children[0].As<int>().Value);
        this.streamWriter.Write(CSharpSyntax.EndStatement);
    }
}

public static class CSharpSyntax
{
    public const string ReturnKeyword = "return";
    public const string EndStatement = ";";
}
