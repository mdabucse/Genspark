using System;
using Users;
using Accounts;
using UsersRepo;
using Services;
namespace CRUD
{
    public class CRUDOperations
    {
        private static readonly NotificationService _notificationService = new NotificationService();

        private static void SendEmailNotification(UserDetails recipient, string message)
        {
            if (recipient == null || string.IsNullOrWhiteSpace(recipient.Email))
            {
                Console.WriteLine("Skipping email: recipient email is missing.");
                return;
            }

            _notificationService.SendNotification(new EmailNotification(), recipient, message);
        }

        public static void CreateAccount(AccountRepository accountRepository, UserRepository userRepository)
        {
            Console.Write("Please enter username: ");
            string username = Console.ReadLine()?.Trim() ?? "";

            Console.Write("Please enter email: ");
            string email = Console.ReadLine()?.Trim() ?? "";

            Console.Write("Please enter phone number: ");
            string phoneNumber = Console.ReadLine()?.Trim() ?? "";

            Console.Write("Enter initial deposit: ");
            float initialDeposit = float.Parse(Console.ReadLine() ?? "0");

            var account = new Account
            {
                UserName = username,
                Balance = initialDeposit
            };

            var userDetails = new UserDetails
            {
                UserName = username,
                Email = email,
                PhoneNumber = phoneNumber
            };

            var createdAccount = accountRepository.Create(account);
            var createdUser = userRepository.Create(userDetails);

            Console.WriteLine("Account created successfully!");
            Console.WriteLine($"Account number: {createdAccount.AccountNumber}");
            Console.WriteLine($"User: {createdUser.UserName} registered!");

            SendEmailNotification(createdUser, $"Your account {createdAccount.AccountNumber} has been created with balance {createdAccount.Balance}.");
        }

        public static void ViewAccount(AccountRepository accountRepository, UserRepository userRepository)
        {
            Console.Write("Enter account number: ");
            string accountNumber = Console.ReadLine() ?? "";

            var account = accountRepository.Read(accountNumber);

            if (account != null)
            {
                Console.WriteLine("\n--- Account Details ---");
                Console.WriteLine($"Account Number: {account.AccountNumber}");
                Console.WriteLine($"Balance: {account.Balance}");
                Console.WriteLine($"Username: {account.UserName}");

                if (!string.IsNullOrWhiteSpace(account.UserName))
                {
                    var userDetails = userRepository.Read(account.UserName);
                    if (userDetails != null)
                    {
                        Console.WriteLine("\n--- User Details ---");
                        Console.WriteLine($"Username: {userDetails.UserName}");
                        Console.WriteLine($"Email: {userDetails.Email}");
                        Console.WriteLine($"Phone: {userDetails.PhoneNumber}");
                    }
                    else
                    {
                        Console.WriteLine("User details not found for this account.");
                    }
                }
                else
                {
                    Console.WriteLine("No user linked to this account.");
                }
            }
            else
            {
                Console.WriteLine("Account not found");
            }
        }

        public static void UpdateAccount(AccountRepository accountRepository, UserRepository userRepository)
        {
            Console.Write("Enter account number: ");
            string accountNumber = Console.ReadLine() ?? "";

            var existingAccount = accountRepository.Read(accountNumber);

            if (existingAccount == null)
            {
                Console.WriteLine("Account not found.");
                return;
            }

            Console.Write("Enter new balance: ");
            float newBalance = float.Parse(Console.ReadLine() ?? "0");

            var updatedAccount = new Account
            {
                AccountNumber = existingAccount.AccountNumber,
                UserName = existingAccount.UserName,
                Balance = newBalance
            };

            var result = accountRepository.Update(accountNumber, updatedAccount);

            if (result != null)
            {
                Console.WriteLine("Account updated successfully!");
                if (!string.IsNullOrWhiteSpace(existingAccount.UserName))
                {
                    var userDetails = userRepository.Read(existingAccount.UserName);
                    if (userDetails != null)
                    {
                        SendEmailNotification(userDetails, $"Your account {result.AccountNumber} balance was updated to {result.Balance}.");
                    }
                }
            }
        }

        public static void DeleteAccount(AccountRepository accountRepository, UserRepository userRepository)
        {
            Console.Write("Enter account number to delete: ");
            string accountNumber = Console.ReadLine() ?? "";

            var account = accountRepository.Read(accountNumber);

            if (account == null)
            {
                Console.WriteLine("Account not found.");
                return;
            }

            // Send notification before deletion
            if (!string.IsNullOrWhiteSpace(account.UserName))
            {
                var userDetails = userRepository.Read(account.UserName);
                if (userDetails != null)
                {
                    SendEmailNotification(userDetails, $"Your account {account.AccountNumber} has been deleted.");
                }
            }

            var deletedAccount = accountRepository.Delete(accountNumber);

            if (deletedAccount != null)
            {
                Console.WriteLine("Account deleted successfully!");
                
                // Also delete the associated user
                if (!string.IsNullOrWhiteSpace(account.UserName))
                {
                    var deletedUser = userRepository.Delete(account.UserName);
                    if (deletedUser != null)
                    {
                        Console.WriteLine($"Associated user '{deletedUser.UserName}' also deleted.");
                    }
                }
            }
        }
    }

}
