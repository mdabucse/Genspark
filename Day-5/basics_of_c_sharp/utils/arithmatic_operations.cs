using System;

class ArithmeticDemo
{
    internal static void PerformArithmeticOperations()
    {
        int a = 10;
        int b = 3;

        // Addition
        int sum = a + b;
        Console.WriteLine("Addition: " + sum);

        // Subtraction
        int difference = a - b;
        Console.WriteLine("Subtraction: " + difference);

        // Multiplication
        int product = a * b;
        Console.WriteLine("Multiplication: " + product);

        // Division
        int division = a / b;  // integer division
        Console.WriteLine("Division: " + division);

        // Modulus (remainder)
        int remainder = a % b;
        Console.WriteLine("Modulus: " + remainder);

        // Increment
        a++;
        Console.WriteLine("Increment: " + a);

        // Decrement
        b--;
        Console.WriteLine("Decrement: " + b);

        // Compound assignment
        a += 5;  // a = a + 5
        Console.WriteLine("a += 5: " + a);

        b *= 2;  // b = b * 2
        Console.WriteLine("b *= 2: " + b);
    }
}

