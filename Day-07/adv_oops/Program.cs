using System;
using UnderstandingOOPSApp.Models;

namespace UnderstandingOOPSApp
{
    internal class Program
    {
        static void Main(string[] args)
        {
            // Step 1: Create repository
            AccountRepository repo = new AccountRepository();

            // Step 2: Create accounts
            var acc1 = new Account
            {
                NameOnAccount = "John",
                Email = "john@gmail.com",
                Phone = "1234567890",
                Balance = 5000,
                AccountType = AccType.SavingAccount
            };

            var acc2 = new Account
            {
                NameOnAccount = "Alice",
                Email = "alice@gmail.com",
                Phone = "9876543210",
                Balance = 8000,
                AccountType = AccType.CurrentAccount
            };

            // Step 3: Add accounts
            repo.Create(acc1);
            repo.Create(acc2);

            // Step 4: Get all accounts
            Console.WriteLine("---- ALL ACCOUNTS ----");
            var accounts = repo.GetAccounts();

            if (accounts != null)
            {
                foreach (var acc in accounts)
                {
                    Console.WriteLine(acc);
                    Console.WriteLine("----------------------");
                }
            }

            // Step 5: Get single account
            Console.WriteLine("\n---- GET ONE ACCOUNT ----");
            var single = repo.GetAccount(acc1.AccountNumber);
            if (single != null)
                Console.WriteLine(single);

            // Step 6: Update account
            Console.WriteLine("\n---- UPDATE ACCOUNT ----");
            acc1.Balance = 10000;
            repo.Update(acc1.AccountNumber, acc1);

            var updated = repo.GetAccount(acc1.AccountNumber);
            if (updated != null)
                Console.WriteLine(updated);

            // Step 7: Delete account
            Console.WriteLine("\n---- DELETE ACCOUNT ----");
            repo.Delete(acc2.AccountNumber);

            var afterDelete = repo.GetAccounts();
            if (afterDelete != null)
            {
                foreach (var acc in afterDelete)
                {
                    Console.WriteLine(acc);
                    Console.WriteLine("----------------------");
                }
            }

            Console.ReadLine();
        }
    }
}