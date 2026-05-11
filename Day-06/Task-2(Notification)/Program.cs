using NotificationInterface;
using Services;
using Users;
class Program
{
    static void Main(string[] args)
    {
        // Get the user Details from the user
        // Create user
        Console.Write("Please enter the user name");
        string UserName = Console.ReadLine();

        Console.Write("Please enter the Email");
        string Email = Console.ReadLine();

        Console.Write("Please enter the Phone Number");
        string PhoneNumber = Console.ReadLine();

        Console.Write("Please enter the Email message");
        string messEmail = Console.ReadLine();

        Console.Write("Please enter the Phone message");
        string messMessage = Console.ReadLine();

        UserDetails firstUser = new UserDetails
        {
            UserName = UserName,
            Email = Email,
            PhoneNumber = PhoneNumber
        };


        // Create service
        NotificationService notificationService = new NotificationService();

        // Send Email
        INotification emailNotification = new EmailNotification();
        notificationService.SendNotification(emailNotification, firstUser, messEmail);

        // Send SMS
        INotification smsNotification = new SmsNotification();
        notificationService.SendNotification(smsNotification, firstUser, messMessage);
    }
}