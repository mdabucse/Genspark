namespace NotificationAppModelLibrary
{
    public class UserDetails
    {
        public int Id { get; set; }

        public string UserName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        // One User -> Many Accounts
        public ICollection<Account>? Accounts { get; set; }
    }
}