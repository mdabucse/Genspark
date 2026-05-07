using NotificationAppModelLibrary;
using NotificationAppDALLibrary;
namespace NotificationAppBLLibrary
{
    public class NotificationService
    {
        public void SendNotification(INotification notification, UserDetails userDetails, string message)
        {
            notification.Send(userDetails, message);
        }
    }
}