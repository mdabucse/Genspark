using System;
using NotificationAppModelLibrary;
namespace NotificationAppDALLibrary
{
    public class NotificationRepository
{
    private List<Notification> notifications = new();

    public void Save(Notification notification)
    {
        notifications.Add(notification);
    }

    public List<Notification> GetAll()
    {
        return notifications;
    }
}
}