using System;
using DisconnectedArchitectureDemo;

public class Perform
{
    static void Main(string[] args)
    {
        Console.WriteLine("Disconnected Architecture Demo");
        Console.WriteLine();

        // Creating object for Program class
        Program program = new Program();

        // Calling disconnected architecture method
        program.GetProductDataUsingDataTable();

        Console.WriteLine();
        Console.WriteLine("Data fetched successfully.");
    }
}