using System;
class DataTypesDemo
{
    internal static void DisplayDataTypes() 
    {
        // Boolean
        bool isActive = true;

        // Integer types
        byte byteValue = 255;
        sbyte signedByteValue = -100;
        short shortValue = -30000;
        ushort ushortValue = 60000;
        int intValue = 100000;
        uint uintValue = 4000000000;
        long longValue = 9000000000000;
        ulong ulongValue = 18000000000000;

        // Native integers
        nint nativeInt = 12345;
        nuint nativeUInt = 12345;

        // Floating point types
        float floatValue = 3.14f;
        double doubleValue = 3.1415926535;
        decimal decimalValue = 99.99m;

        // Character
        char grade = 'A';

        // Output all values
        Console.WriteLine($"bool: {isActive}");
        Console.WriteLine($"byte: {byteValue}");
        Console.WriteLine($"sbyte: {signedByteValue}");
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
        Console.WriteLine($"char: {grade}");
    }
}