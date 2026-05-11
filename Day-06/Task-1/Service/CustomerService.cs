using System;
using System.Collections.Generic;

namespace UnderstandingOOPSApp
{
    internal class CustomerService
    {
        List<Account> accounts = new List<Account>();
        static string lastAccountNumber = "9990001000";

        public Account OpensAccount()
        {
            Account account = TakeCustomerDetails();

            TakeInitialDeposit(account);

            long accNum = Convert.ToInt64(lastAccountNumber);
            account.AccountNumber = (++accNum).ToString();
            lastAccountNumber = accNum.ToString();

            accounts.Add(account);

            return account;
        }

        private void TakeInitialDeposit(Account account)
        {
            Console.WriteLine("Enter initial deposit (or 0):");

            float amount = 0;

            while (!float.TryParse(Console.ReadLine(), out amount))
            {
                Console.WriteLine("Invalid amount. Try again:");
            }

            account.Balance += amount;
        }

        private Account TakeCustomerDetails()
        {
            Account account = new Account();

            Console.WriteLine("Select account type: 1. Saving  2. Current");

            int typeChoice;

            while (!int.TryParse(Console.ReadLine(), out typeChoice) || typeChoice < 1 || typeChoice > 2)
            {
                Console.WriteLine("Invalid choice. Try again:");
            }

            if (typeChoice == 1)
                account = new SavingAccount();
            else
                account = new CurrentAccount();

            Console.WriteLine("Enter your name:");
            account.NameOnAccount = Console.ReadLine() ?? "";

            Console.WriteLine("Enter DOB (yyyy-mm-dd):");

            DateTime dob;

            while (!DateTime.TryParse(Console.ReadLine(), out dob))
            {
                Console.WriteLine("Invalid date. Try again:");
            }

            account.DateOfBirth = dob;

            Console.WriteLine("Enter email:");
            account.Email = Console.ReadLine() ?? "";

            Console.WriteLine("Enter phone:");
            account.Phone = Console.ReadLine() ?? "";

            return account;
        }
    }
}