namespace FluentAPI.Models
{
    public class Account
{
    public string AccountNumber { get; set; } = string.Empty;

    public int CustomerId { get; set; }

    public Customer? Customer { get; set; }
}
}