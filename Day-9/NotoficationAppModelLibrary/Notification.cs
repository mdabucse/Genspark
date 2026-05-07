using System;

namespace NotificationAppModelLibrary
{
    public class Notification
    {
        public string? Message { get; set; }

        public string? NotificationType { get; set; }

        public DateTime SentDate { get; set; }
    }
}