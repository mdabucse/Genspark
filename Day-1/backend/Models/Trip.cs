using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusBooking.API.Models;

[Table("trips")]
public class Trip
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("bus_id")]
    public int BusId { get; set; }

    [Column("route_id")]
    public int RouteId { get; set; }

    [Required]
    [Column("departure_time")]
    public DateTime DepartureTime { get; set; }

    [Required]
    [Column("arrival_time")]
    public DateTime ArrivalTime { get; set; }

    [Required]
    [Column("base_fare")]
    public decimal BaseFare { get; set; }

    [Column("tax_percent")]
    public decimal TaxPercent { get; set; } = 5.0m;

    [MaxLength(20)]
    [Column("status")]
    public string Status { get; set; } = "scheduled"; // scheduled, cancelled, completed

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("BusId")]
    public Bus Bus { get; set; } = null!;

    [ForeignKey("RouteId")]
    public Route Route { get; set; } = null!;

    public ICollection<TripSeatStatus> TripSeatStatuses { get; set; } = new List<TripSeatStatus>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
