using System;
using System.IO;
using AssemblyLine.Compiler.Backendss;

namespace AssemblyLine.Compiler;

public sealed class Transpiler
{
    private readonly BackendBase backend;

    public Transpiler(BackendBase backend)
    {
        this.backend = backend ??
            throw new ArgumentNullException(nameof(backend));
    }

    public void TranspileFile(Stream inStream)
    {
        var tokenizer = new Tokenizer(inStream);
        var parser = new Parser(tokenizer);

        var root = parser.Parse();

        this.backend.VisitRootNode(root);
    }
}
