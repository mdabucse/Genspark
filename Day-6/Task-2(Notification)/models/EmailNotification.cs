using NotificationInterface;
using Users;
using System.Net;
using System.Net.Mail;

public class EmailNotification : INotification
{
    public void Send(UserDetails userDetails, string message)
    {
        if (string.IsNullOrWhiteSpace(userDetails.Email))
        {
            throw new ArgumentException("A valid email address is required.", nameof(userDetails.Email));
        }

        try
        {
            var fromAddress = new MailAddress("mail", "subject");
            var toAddress = new MailAddress(userDetails.Email);

            string fromPassword = ""; //  Your password here
            string subject = "Notification";

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };

            var mailMessage = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = message
            };

            smtp.Send(mailMessage);

            Console.WriteLine("Email sent successfully");
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error sending email: " + ex.Message);
        }
    }
}