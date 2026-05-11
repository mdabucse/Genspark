using NotificationAppBLLibrary;
using NotificationAppDALLibrary;
using NotificationAppModelLibrary;

class Program
{
    static void Main(string[] args)
    {
        AccountRepository accountRepository = new AccountRepository();

        UserRepository userRepository = new UserRepository();

        NotificationService notificationService = new NotificationService();

        while (true)
        {
            Console.WriteLine("\n===== Notification System =====");

            Console.WriteLine("1. Create Account");
            Console.WriteLine("2. Send Notification");
            Console.WriteLine("3. View Notifications");
            Console.WriteLine("4. Exit");

            Console.Write("Enter your choice: ");

            int choice = int.Parse(Console.ReadLine() ?? "0");

            switch (choice)
            {
                // CREATE ACCOUNT
                case 1:

                    Console.Write("Enter Username: ");
                    string username = Console.ReadLine() ?? "";

                    Console.Write("Enter Email: ");
                    string email = Console.ReadLine() ?? "";

                    Console.Write("Enter Phone Number: ");
                    string phoneNumber = Console.ReadLine() ?? "";

                    Console.Write("Enter Initial Balance: ");

                    float balance =
                        float.Parse(Console.ReadLine() ?? "0");

                    UserDetails user = new UserDetails
                    {
                        UserName = username,
                        Email = email,
                        PhoneNumber = phoneNumber
                    };

                    Account account = new Account
                    {
                        UserName = username,
                        Balance = balance
                    };

                    var createdUser =
                        userRepository.Create(user);

                    var createdAccount =
                        accountRepository.Create(account);

                    Console.WriteLine(
                        "\nAccount Created Successfully"
                    );

                    Console.WriteLine(
                        $"Account Number : {createdAccount.AccountNumber}"
                    );

                    break;

                // SEND NOTIFICATION
                case 2:

                    Console.Write("Enter Account Number: ");

                    string accountNumber =
                        Console.ReadLine() ?? "";

                    var existingAccount =
                        accountRepository.Read(accountNumber);

                    if (existingAccount == null)
                    {
                        Console.WriteLine("Account Not Found");

                        break;
                    }

                    var existingUser =
                        userRepository.Read(
                            existingAccount.UserName ?? ""
                        );

                    if (existingUser == null)
                    {
                        Console.WriteLine("User Not Found");

                        break;
                    }

                    Console.WriteLine(
                        "\nChoose Notification Type"
                    );

                    Console.WriteLine("1. Email");
                    Console.WriteLine("2. SMS");

                    Console.Write("Enter choice: ");

                    int notificationChoice =
                        int.Parse(Console.ReadLine() ?? "0");

                    INotification notificationSender;

                    string notificationType;

                    if (notificationChoice == 1)
                    {
                        notificationSender =
                            new EmailNotification();

                        notificationType = "Email";
                    }
                    else if (notificationChoice == 2)
                    {
                        notificationSender =
                            new SmsNotification();

                        notificationType = "SMS";
                    }
                    else
                    {
                        Console.WriteLine(
                            "Invalid Notification Type"
                        );

                        break;
                    }

                    Console.Write("Enter Message: ");

                    string message =
                        Console.ReadLine() ?? "";

                    Notification notification =
                        new Notification
                        {
                            AccountNumber =
                                existingAccount.AccountNumber,

                            UserName =
                                existingUser.UserName,

                            Message = message,

                            NotificationType =
                                notificationType
                        };

                    try
                    {
                        notificationService.SendNotification(
                            notificationSender,
                            existingUser,
                            notification
                        );
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(
                            $"Error : {ex.Message}"
                        );
                    }

                    break;

                // VIEW NOTIFICATIONS
                case 3:

                    List<Notification> notifications =
                        notificationService
                            .GetAllNotifications();

                    if (notifications.Count == 0)
                    {
                        Console.WriteLine(
                            "No Notifications Sent Yet"
                        );
                    }
                    else
                    {
                        Console.WriteLine(
                            "\n===== Sent Notifications ====="
                        );

                        foreach (var item in notifications)
                        {
                            Console.WriteLine(
                                $"Account Number : {item.AccountNumber}"
                            );

                            Console.WriteLine(
                                $"Username : {item.UserName}"
                            );

                            Console.WriteLine(
                                $"Notification Type : {item.NotificationType}"
                            );

                            Console.WriteLine(
                                $"Message : {item.Message}"
                            );

                            Console.WriteLine(
                                $"Sent Date : {item.SentDate}"
                            );

                            Console.WriteLine(
                                "--------------------------------"
                            );
                        }
                    }

                    break;

                case 4:

                    Console.WriteLine(
                        "Exiting Application..."
                    );

                    return;

                default:

                    Console.WriteLine(
                        "Invalid Choice"
                    );

                    break;
            }
        }
    }
}