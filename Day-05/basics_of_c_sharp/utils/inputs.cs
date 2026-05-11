using System;

class Inputs
{
    internal static void ReadAllInputs()
    {
        // String
        Console.Write("Enter Name: ");
        string name = Console.ReadLine();

        // Boolean
        Console.Write("Enter true/false: ");
        bool isActive = bool.Parse(Console.ReadLine());

        // Integer types
        Console.Write("Enter byte (0-255): ");
        byte byteValue = byte.Parse(Console.ReadLine());

        Console.Write("Enter sbyte (-128 to 127): ");
        sbyte sbyteValue = sbyte.Parse(Console.ReadLine());

        Console.Write("Enter short: ");
        short shortValue = short.Parse(Console.ReadLine());

        Console.Write("Enter ushort: ");
        ushort ushortValue = ushort.Parse(Console.ReadLine());

        Console.Write("Enter int: ");
        int intValue = int.Parse(Console.ReadLine());

        Console.Write("Enter uint: ");
        uint uintValue = uint.Parse(Console.ReadLine());

        Console.Write("Enter long: ");
        long longValue = long.Parse(Console.ReadLine());

        Console.Write("Enter ulong: ");
        ulong ulongValue = ulong.Parse(Console.ReadLine());

        // Native types
        Console.Write("Enter nint: ");
        nint nativeInt = nint.Parse(Console.ReadLine());

        Console.Write("Enter nuint: ");
        nuint nativeUInt = nuint.Parse(Console.ReadLine());

        // Floating types
        Console.Write("Enter float: ");
        float floatValue = float.Parse(Console.ReadLine());

        Console.Write("Enter double: ");
        double doubleValue = double.Parse(Console.ReadLine());

        Console.Write("Enter decimal: ");
        decimal decimalValue = decimal.Parse(Console.ReadLine());

        // Char
        Console.Write("Enter a character: ");
        char character = char.Parse(Console.ReadLine());

        // Output
        Console.WriteLine("\n--- Output ---");
        Console.WriteLine($"Name: {name}");
        Console.WriteLine($"Bool: {isActive}");
        Console.WriteLine($"byte: {byteValue}");
        Console.WriteLine($"sbyte: {sbyteValue}");
        Console.WriteLine($"short: {shortValue}");
        Console.WriteLine($"ushort: {ushortValue}");
        Console.WriteLine($"int: {intValue}");
        Console.WriteLine($"uint: {uintValue}");
        Console.WriteLine($"long: {longValue}");
        Console.WriteLine($"ulong: {ulongValue}");
        Console.WriteLine($"nint: {nativeInt}");
        Console.WriteLine($"nuint: {nativeUInt}");
        Console.WriteLine($"float: {floatValue}");
        Console.WriteLine($"double: {doubleValue}");
        Console.WriteLine($"decimal: {decimalValue}");
        Console.WriteLine($"char: {character}");
    }
}