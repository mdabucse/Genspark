namespace NotificationAppModelLibrary
{
    public class Account
    {
        public string AccountNumber { get; set; } = string.Empty;

        public decimal Balance { get; set; }

        public DateTime CreatedDate { get; set; }

        // Foreign Key
        public int UserDetailsId { get; set; }

        // Navigation Property
        public UserDetails? User { get; set; }

        // One Account -> Many Notifications
        public ICollection<Notification>? Notifications { get; set; }
    }
}