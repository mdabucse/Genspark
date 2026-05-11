using System;

class TypeCastingDemo
{
    internal static void AllTypeCastings()
    {
        // Implicit casting (small to big)
        int intValue = 100;
        long longValue = intValue;
        float floatValue = longValue;
        double doubleValue = floatValue;

        Console.WriteLine("Implicit Casting:");
        Console.WriteLine(doubleValue);

        // Explicit casting (big to small)
        double d = 123.45;
        int i = (int)d;  // decimal part removed

        Console.WriteLine("\nExplicit Casting:");
        Console.WriteLine(i);

        // Convert method
        string strNumber = "200";
        int convertedValue = Convert.ToInt32(strNumber);

        Console.WriteLine("\nConvert:");
        Console.WriteLine(convertedValue);

        // Parse method
        string str = "300";
        int parsedValue = int.Parse(str);

        Console.WriteLine("\nParse:");
        Console.WriteLine(parsedValue);

        // TryParse method
        string input = "400";
        if (int.TryParse(input, out int result))
        {
            Console.WriteLine("\nTryParse:");
            Console.WriteLine(result);
        }
        else
        {
            Console.WriteLine("Invalid input");
        }

        // Boxing (value to object)
        int num = 10;
        object obj = num;

        Console.WriteLine("\nBoxing:");
        Console.WriteLine(obj);

        // Unboxing (object to value)
        object boxed = 20;
        int unboxed = (int)boxed;

        Console.WriteLine("\nUnboxing:");
        Console.WriteLine(unboxed);

        // ToString conversion
        int number = 500;
        string strValue = number.ToString();

        Console.WriteLine("\nToString:");
        Console.WriteLine(strValue);

        // Char to int
        char ch = 'A';
        int asciiValue = ch;

        Console.WriteLine("\nChar to Int:");
        Console.WriteLine(asciiValue);

        // Invalid casting example
        try
        {
            object objValue = "Hello";
            int invalidCast = (int)objValue;
        }
        catch (Exception ex)
        {
            Console.WriteLine("\nInvalid Cast:");
            Console.WriteLine(ex.Message);
        }
    }
}
