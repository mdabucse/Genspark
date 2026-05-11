namespace NotificationAppModelLibrary
{
    public class Notification
    {
        public string? AccountNumber { get; set; }

        public string? UserName { get; set; }

        public string? Message { get; set; }

        public string? NotificationType { get; set; }

        public DateTime SentDate { get; set; }
    }
}