using System;
using Microsoft.EntityFrameworkCore;
using TransactionsSP.Models;
internal class Program
    {
        readonly GensparkContext _context;
        Program()
        {
            _context = new GensparkContext();
        }

        void TransactWithTransactioninDatabase()
        {
            Account fc = new Account() { Accno = 2 };
            Account tc = new Account() { Accno = 3};
            float amount = 1500;
            fc = _context.Accounts.FirstOrDefault(a => a.Accno == fc.Accno);
            tc = _context.Accounts.FirstOrDefault(a => a.Accno == tc.Accno);
            using var transaction = _context.Database.BeginTransaction();
            try
            {

                _context.Database.ExecuteSqlInterpolated($"call add_trans({fc.Accno},{tc.Accno},{amount})");
                if (fc.Balance - amount <= 0)
                    throw new Exception("Insuffienct balance");
                _context.Database.ExecuteSqlInterpolated($"call update_account({fc.Accno},{fc.Balance-amount})");
                _context.Database.ExecuteSqlInterpolated($"call update_account({tc.Accno},{tc.Balance + amount})");
                transaction.Commit();
                Console.WriteLine("Transaction successfull");
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                Console.WriteLine(ex.Message);
            }
        }

        void AddAccountUsingSP()
        {
            Account account = new Account() { Accno = 6, Balance = 1233.3f };
            //call add_account(4,3243);
            _context.Database.ExecuteSqlInterpolated($"call add_account({account.Accno},{account.Balance});");
            Console.WriteLine("Account Created");
        }
        static void Main(string[] args)
        {
            // new Program().AddAccountUsingSP();
            new Program().TransactWithTransactioninDatabase();
        }
}