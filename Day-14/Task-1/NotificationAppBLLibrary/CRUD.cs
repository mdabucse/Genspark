using System;
using NotificationAppModelLibrary;
using NotificationAppDALLibrary;

namespace NotificationAppBLLibrary
{
    public class CRUDOperations
    {
        private static readonly NotificationService _notificationService =
            new NotificationService();

        private static void SendEmailNotification(
            UserDetails recipient,
            string message
        )
        {
            if (
                recipient == null
                || string.IsNullOrWhiteSpace(recipient.Email)
            )
            {
                Console.WriteLine(
                    "Skipping email: recipient email is missing."
                );

                return;
            }

            Notification notification =
                new Notification
                {
                    Message = message,
                    NotificationType = "Email",
                    SentDate = DateTime.Now
                };

            _notificationService.SendNotification(
                new EmailNotification(),
                recipient,
                notification
            );
        }

        // Create Account
        public static void CreateAccount(
            AccountRepository accountRepository,
            UserRepository userRepository
        )
        {
            Console.Write("Please enter username: ");
            string username =
                Console.ReadLine()?.Trim() ?? "";

            Console.Write("Please enter email: ");
            string email =
                Console.ReadLine()?.Trim() ?? "";

            Console.Write("Please enter phone number: ");
            string phoneNumber =
                Console.ReadLine()?.Trim() ?? "";

            Console.Write("Enter initial deposit: ");
            decimal initialDeposit =
                decimal.Parse(Console.ReadLine() ?? "0");

            // Create User
            var userDetails =
                new UserDetails
                {
                    UserName = username,
                    Email = email,
                    PhoneNumber = phoneNumber
                };

            var createdUser =
                userRepository.Create(userDetails);

            // Create Account
            var account =
                new Account
                {
                    Balance = initialDeposit,
                    CreatedDate = DateTime.Now,
                    UserDetailsId = createdUser.Id
                };

            var createdAccount =
                accountRepository.Create(account);

            Console.WriteLine(
                "Account created successfully!"
            );

            Console.WriteLine(
                $"Account Number: {createdAccount.AccountNumber}"
            );

            Console.WriteLine(
                $"User: {createdUser.UserName} registered!"
            );

            SendEmailNotification(
                createdUser,
                $"Your account {createdAccount.AccountNumber} has been created with balance {createdAccount.Balance}."
            );
        }

        // View Account
        public static void ViewAccount(
            AccountRepository accountRepository
        )
        {
            Console.Write("Enter account number: ");

            string accountNumber =
                Console.ReadLine() ?? "";

            var account =
                accountRepository.Read(accountNumber);

            if (account != null)
            {
                Console.WriteLine(
                    "\n--- Account Details ---"
                );

                Console.WriteLine(
                    $"Account Number: {account.AccountNumber}"
                );

                Console.WriteLine(
                    $"Balance: {account.Balance}"
                );

                Console.WriteLine(
                    $"Created Date: {account.CreatedDate}"
                );

                if (account.User != null)
                {
                    Console.WriteLine(
                        "\n--- User Details ---"
                    );

                    Console.WriteLine(
                        $"Username: {account.User.UserName}"
                    );

                    Console.WriteLine(
                        $"Email: {account.User.Email}"
                    );

                    Console.WriteLine(
                        $"Phone: {account.User.PhoneNumber}"
                    );
                }
            }
            else
            {
                Console.WriteLine("Account not found");
            }
        }

        // Update Account
        public static void UpdateAccount(
            AccountRepository accountRepository
        )
        {
            Console.Write("Enter account number: ");

            string accountNumber =
                Console.ReadLine() ?? "";

            var existingAccount =
                accountRepository.Read(accountNumber);

            if (existingAccount == null)
            {
                Console.WriteLine("Account not found.");

                return;
            }

            Console.Write("Enter new balance: ");

            decimal newBalance =
                decimal.Parse(Console.ReadLine() ?? "0");

            var updatedAccount =
                new Account
                {
                    AccountNumber =
                        existingAccount.AccountNumber,

                    Balance = newBalance,

                    CreatedDate =
                        existingAccount.CreatedDate,

                    UserDetailsId =
                        existingAccount.UserDetailsId
                };

            var result =
                accountRepository.Update(
                    accountNumber,
                    updatedAccount
                );

            if (result != null)
            {
                Console.WriteLine(
                    "Account updated successfully!"
                );

                if (existingAccount.User != null)
                {
                    SendEmailNotification(
                        existingAccount.User,
                        $"Your account {result.AccountNumber} balance was updated to {result.Balance}."
                    );
                }
            }
        }

        // Delete Account
        public static void DeleteAccount(
            AccountRepository accountRepository
        )
        {
            Console.Write(
                "Enter account number to delete: "
            );

            string accountNumber =
                Console.ReadLine() ?? "";

            var account =
                accountRepository.Read(accountNumber);

            if (account == null)
            {
                Console.WriteLine("Account not found.");

                return;
            }

            // Send notification before deletion
            if (account.User != null)
            {
                SendEmailNotification(
                    account.User,
                    $"Your account {account.AccountNumber} has been deleted."
                );
            }

            var deletedAccount =
                accountRepository.Delete(accountNumber);

            if (deletedAccount != null)
            {
                Console.WriteLine(
                    "Account deleted successfully!"
                );
            }
        }
    }
}