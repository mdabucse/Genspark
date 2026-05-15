namespace LMS.FE.Helpers;

public static class InputHelper
{
    public static int ReadInt(string message)
    {
        Console.Write(message);

        return Convert.ToInt32(Console.ReadLine());
    }

    public static string ReadString(string message)
    {
        Console.Write(message);

        return Console.ReadLine()!;
    }

    public static decimal ReadDecimal(string message)
    {
        Console.Write(message);

        return Convert.ToDecimal(Console.ReadLine());
    }

    public static DateTime ReadDate(string message)
    {
        Console.Write(message);

        return Convert.ToDateTime(Console.ReadLine());
    }
}