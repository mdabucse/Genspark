using NotificationAppBLLibrary;
using NotificationAppModelLibrary;

class Program
{
    static void Main(string[] args)
    {
        NotificationService notificationService =
            new NotificationService();

        while (true)
        {
            Console.WriteLine("\n===== Notification System =====");

            Console.WriteLine("1. Send Notification");
            Console.WriteLine("2. View Sent Notifications");
            Console.WriteLine("3. Exit");

            Console.Write("Enter your choice: ");

            int choice = int.Parse(Console.ReadLine() ?? "0");

            switch (choice)
            {
                case 1:

                    // User Details
                    Console.Write("Enter Username: ");
                    string username = Console.ReadLine() ?? "";

                    Console.Write("Enter Email: ");
                    string email = Console.ReadLine() ?? "";

                    Console.Write("Enter Phone Number: ");
                    string phoneNumber = Console.ReadLine() ?? "";

                    UserDetails user = new UserDetails
                    {
                        UserName = username,
                        Email = email,
                        PhoneNumber = phoneNumber
                    };

                    // Notification Type
                    Console.WriteLine("\nChoose Notification Type");

                    Console.WriteLine("1. Email");
                    Console.WriteLine("2. SMS");

                    Console.Write("Enter choice: ");

                    int notificationChoice =
                        int.Parse(Console.ReadLine() ?? "0");

                    INotification notificationSender;

                    string notificationType;

                    if (notificationChoice == 1)
                    {
                        notificationSender = new EmailNotification();

                        notificationType = "Email";
                    }
                    else if (notificationChoice == 2)
                    {
                        notificationSender = new SmsNotification();

                        notificationType = "SMS";
                    }
                    else
                    {
                        Console.WriteLine("Invalid Notification Type");

                        break;
                    }

                    // Message
                    Console.Write("Enter Message: ");

                    string message = Console.ReadLine() ?? "";

                    Notification notification = new Notification
                    {
                        Message = message,
                        NotificationType = notificationType
                    };

                    try
                    {
                        notificationService.SendNotification(
                            notificationSender,
                            user,
                            notification
                        );
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error : {ex.Message}");
                    }

                    break;

                case 2:

                    List<Notification> notifications =
                        notificationService.GetAllNotifications();

                    if (notifications.Count == 0)
                    {
                        Console.WriteLine("No Notifications Sent Yet");
                    }
                    else
                    {
                        Console.WriteLine("\n===== Sent Notifications =====");

                        foreach (var item in notifications)
                        {
                            Console.WriteLine(
                                $"Notification Type : {item.NotificationType}"
                            );

                            Console.WriteLine(
                                $"Message : {item.Message}"
                            );

                            Console.WriteLine(
                                $"Sent Date : {item.SentDate}"
                            );

                            Console.WriteLine("--------------------------------");
                        }
                    }

                    break;

                case 3:

                    Console.WriteLine("Exiting Application...");

                    return;

                default:

                    Console.WriteLine("Invalid Choice");

                    break;
            }
        }
    }
}