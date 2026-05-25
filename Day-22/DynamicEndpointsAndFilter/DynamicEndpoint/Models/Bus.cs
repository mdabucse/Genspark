namespace Model;
public class Bus
{
    public int Id { get; set; }

    public string? BusName { get; set; }

    public string? From { get; set; }

    public string? To { get; set; }

    public bool IsAC { get; set; }

    public decimal Price { get; set; }

    public int AvailableSeats { get; set; }
}