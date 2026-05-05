using System;
using System.Collections.Generic;
using IUser;
using Accounts;

namespace UsersRepo 
{
    public class AccountRepository : IRepository<string, Account>
    {
        static string lastAccountNumber = "9990001000";
        Dictionary<string, Account> _accountMap = new Dictionary<string, Account>();

        public Account Create(Account value)
        {
            lastAccountNumber = (long.Parse(lastAccountNumber) + 1).ToString();
            value.AccountNumber = lastAccountNumber;
            _accountMap.Add(lastAccountNumber, value);
            return value;
        }

        public Account? Read(string key)
        {
            if (_accountMap.TryGetValue(key, out var account))
            {
                return account;
            }

            Console.WriteLine("Account not found");
            return null;
        }

        public Account? Update(string key, Account value)
        {
            if (_accountMap.ContainsKey(key))
            {
                value.AccountNumber = key;
                _accountMap[key] = value;
                return value;
            }

            Console.WriteLine("Account not found");
            return null;
        }

        public Account? Delete(string key)
        {
            if (_accountMap.TryGetValue(key, out var account))
            {
                _accountMap.Remove(key);
                return account;
            }

            Console.WriteLine("Account not found");
            return null;
        }
    }
}