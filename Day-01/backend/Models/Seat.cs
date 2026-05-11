using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusBooking.API.Models;

[Table("seats")]
public class Seat
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("bus_id")]
    public int BusId { get; set; }

    [Required]
    [MaxLength(10)]
    [Column("seat_number")]
    public string SeatNumber { get; set; } = string.Empty; // e.g. A1, B2, L1

    [MaxLength(20)]
    [Column("seat_type")]
    public string SeatType { get; set; } = "seater"; // seater, sleeper

    [Column("row")]
    public int Row { get; set; }

    [Column("column")]
    public int Column { get; set; }

    [MaxLength(10)]
    [Column("deck")]
    public string Deck { get; set; } = "lower"; // lower, upper

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    // Navigation properties
    [ForeignKey("BusId")]
    public Bus Bus { get; set; } = null!;
    public ICollection<TripSeatStatus> TripSeatStatuses { get; set; } = new List<TripSeatStatus>();
    public ICollection<BookingPassenger> BookingPassengers { get; set; } = new List<BookingPassenger>();
}
