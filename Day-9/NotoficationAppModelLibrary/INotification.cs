using System;

namespace NotificationAppModelLibrary
{
    public interface INotification
    {
        void Send(UserDetails userDetails, string message);
    }
}