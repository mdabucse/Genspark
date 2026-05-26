using System;
using System.Threading.Tasks;
using utils;
namespace Program
{
    class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            int sum = Add.AddTwoNumbers(5, 10);
            int difference = Sub.SubTwoNumbers(10, 5);
            int product = Multiply.MultiplyTwoNumbers(5, 10);
            Console.WriteLine($"Sum: {sum}, Difference: {difference}, Product: {product}");
            try
            {
                
            Console.WriteLine("The Divide Value of 10 and 5 is: " + Divide.DivideTwoNumbers(10, 0));
            }
            catch(Exception e)
            {
                System.Console.WriteLine(e.Message);
            }
        }
    }
}