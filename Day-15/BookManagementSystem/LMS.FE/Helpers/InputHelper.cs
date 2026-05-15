namespace LMS.FE.Helpers;

public static class InputHelper
{
    // Helper method to read an integer input from the console with validation
    public static int ReadInt(string message)
    {
        Console.Write(message);
        string? input = Console.ReadLine();

        if (input == null)
        {
            throw new EndOfStreamException("Input stream ended unexpectedly.");
        }

        if (!int.TryParse(input, out int result))
        {
            throw new FormatException($"Invalid integer input: '{input}'");
        }
        return result;
    }
    // Helper method to read a string input from the console with validation
    public static string ReadString(string message)
    {
        Console.Write(message);
        string? input = Console.ReadLine();
        if (input == null)
        {
            throw new EndOfStreamException("Input stream ended unexpectedly.");
        }
        return input;
    }

    // Helper method to read a decimal input from the console with validation
    public static decimal ReadDecimal(string message)
    {
        Console.Write(message);
        string? input = Console.ReadLine();

        if (input == null)
        {
            throw new EndOfStreamException("Input stream ended unexpectedly.");
        }

        if (!decimal.TryParse(input, out decimal result))
        {
            throw new FormatException($"Invalid decimal input: '{input}'");
        }
        return result;
    }

    // Helper method to read a DateTime input from the console with validation
    public static DateTime ReadDate(string message)
    {
        Console.Write(message);
        string? input = Console.ReadLine();
        if (input == null)
        {
            throw new EndOfStreamException("Input stream ended unexpectedly.");
        }

        if (!DateTime.TryParse(input, out DateTime result))
        {
            throw new FormatException($"Invalid date input: '{input}'");
        }

        return result;
    }
}