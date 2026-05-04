using NotificationInterface;
using Users;
namespace Services
{
    public class NotificationService
    {
        public void SendNotification(INotification notification, UserDetails userDetails, string message)
        {
            notification.Send(userDetails, message);
        }
    }
}