using System.IO;

namespace AssemblyLine.Compiler.Tests;

public static class StringExtensions
{
    public static Stream ToStream(this string value)
    {
        var memoryStream = new MemoryStream();
        
        var writer = new StreamWriter(memoryStream);
        writer.Write(value);
        writer.Flush();

        memoryStream.Position = 0;

        return memoryStream;
    }

    public static string AsString(this MemoryStream stream)
    {
        stream.Position = 0;

        var reader = new StreamReader(stream);

        return reader.ReadToEnd();
    }
}
