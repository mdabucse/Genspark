using System;

namespace UnderstandingOOPSApp
{
    internal class Program
    {
        static void Main(string[] args)
        {
            CustomerService service = new CustomerService();

            Console.WriteLine("Welcome to Bank App");

            Account account = service.OpensAccount();

            Console.WriteLine("\n--- Account Created ---");
            Console.WriteLine(account);

            Console.ReadLine();
        }
    }
}