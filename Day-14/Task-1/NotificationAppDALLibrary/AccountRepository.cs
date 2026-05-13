using Microsoft.EntityFrameworkCore;
using NotificationAppDALLibrary.Contexts;
using NotificationAppModelLibrary;

namespace NotificationAppDALLibrary
{
    public class AccountRepository :
        IRepository<string, Account>
    {
        private readonly AppDbContext _context;

        public AccountRepository()
        {
            _context = new AppDbContext();
        }

        // CREATE
        public Account Create(Account value)
        {
            try
            {
                _context.Accounts.Add(value);

                _context.SaveChanges();

                return value;
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    $"Error Creating Account : {ex.Message}"
                );

                throw;
            }
        }

        // READ
        public Account? Read(string key)
        {
            return _context.Accounts
                .Include(a => a.User)
                .Include(a => a.Notifications)
                .FirstOrDefault(
                    a => a.AccountNumber == key
                );
        }

        // UPDATE
        public Account? Update(
            string key,
            Account value
        )
        {
            var existingAccount =
                _context.Accounts.FirstOrDefault(
                    a => a.AccountNumber == key
                );

            if (existingAccount == null)
            {
                return null;
            }

            existingAccount.Balance =
                value.Balance;

            existingAccount.CreatedDate =
                value.CreatedDate;

            existingAccount.UserDetailsId =
                value.UserDetailsId;

            _context.SaveChanges();

            return existingAccount;
        }

        // DELETE
        public Account? Delete(string key)
        {
            var existingAccount =
                _context.Accounts.FirstOrDefault(
                    a => a.AccountNumber == key
                );

            if (existingAccount == null)
            {
                return null;
            }

            _context.Accounts.Remove(
                existingAccount
            );

            _context.SaveChanges();

            return existingAccount;
        }
    }
}