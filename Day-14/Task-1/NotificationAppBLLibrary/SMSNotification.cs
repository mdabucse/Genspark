using NotificationAppModelLibrary;
using NotificationAppDALLibrary;
namespace NotificationAppBLLibrary
{
    public class SmsNotification : INotification
    {
        public void Send(UserDetails userDetails, string message)
        {
            Console.WriteLine($"SMS sent to {userDetails.PhoneNumber}: {message}");
        }
    }
}
