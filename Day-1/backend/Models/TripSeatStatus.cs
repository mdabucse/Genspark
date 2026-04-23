using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusBooking.API.Models;

[Table("trip_seat_statuses")]
public class TripSeatStatus
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("trip_id")]
    public int TripId { get; set; }

    [Column("seat_id")]
    public int SeatId { get; set; }

    [MaxLength(20)]
    [Column("status")]
    public string Status { get; set; } = "available"; // available, booked, locked

    [Column("locked_by")]
    public int? LockedBy { get; set; }

    [Column("locked_until")]
    public DateTime? LockedUntil { get; set; }

    // Navigation properties
    [ForeignKey("TripId")]
    public Trip Trip { get; set; } = null!;

    [ForeignKey("SeatId")]
    public Seat Seat { get; set; } = null!;

    [ForeignKey("LockedBy")]
    public User? LockedByUser { get; set; }
}
