namespace FluentAPI.Models
{
    public partial class Customer
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public ICollection<Account>? Accounts { get; set; }
}
}