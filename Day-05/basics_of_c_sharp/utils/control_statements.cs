using System;

class ControlStatements
{
    internal static void AllControlStatements()
    {
        int number = 10;

        // if statement
        if (number > 0)
        {
            Console.WriteLine("Number is positive");
        }

        // if-else
        if (number % 2 == 0)
        {
            Console.WriteLine("Even number");
        }
        else
        {
            Console.WriteLine("Odd number");
        }

        // if-else-if ladder
        if (number < 0)
        {
            Console.WriteLine("Negative");
        }
        else if (number == 0)
        {
            Console.WriteLine("Zero");
        }
        else
        {
            Console.WriteLine("Positive");
        }

        // switch statement
        int day = 2;
        switch (day)
        {
            case 1:
                Console.WriteLine("Monday");
                break;
            case 2:
                Console.WriteLine("Tuesday");
                break;
            default:
                Console.WriteLine("Other day");
                break;
        }

        // for loop
        for (int k = 1; k <= 3; k++)
        {
            Console.WriteLine("For loop: " + k);
        }

        // while loop
        int i = 1;
        while (i <= 3)
        {
            Console.WriteLine("While loop: " + i);
            i++;
        }

        // do-while loop
        int j = 1;
        do
        {
            Console.WriteLine("Do-While loop: " + j);
            j++;
        } while (j <= 3);

        // break statement
        for (int k = 1; k <= 5; k++)
        {
            if (k == 3)
                break;

            Console.WriteLine("Break: " + k);
        }

        // continue statement
        for (int k = 1; k <= 5; k++)
        {
            if (k == 3)
                continue;

            Console.WriteLine("Continue: " + k);
        }
    }
}