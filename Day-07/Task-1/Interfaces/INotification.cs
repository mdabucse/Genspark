using Users;

namespace NotificationInterface
{
    public interface INotification
    {
        void Send(UserDetails userDetails, string message);
    }
}