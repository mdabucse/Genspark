namespace NotificationAppModelLibrary
{
    public class Notification
    {
        public int Id { get; set; }

        public string Message { get; set; } = string.Empty;

        public string NotificationType { get; set; } = string.Empty;

        public DateTime SentDate { get; set; }

        // Foreign Key
        public string AccountNumber { get; set; } = string.Empty;

        // Navigation Property
        public Account? Account { get; set; }
    }
}