using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusBooking.API.Models;

[Table("bookings")]
public class Booking
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("trip_id")]
    public int TripId { get; set; }

    [MaxLength(20)]
    [Column("booking_ref")]
    public string BookingRef { get; set; } = string.Empty; // e.g. BK20240001

    [MaxLength(20)]
    [Column("status")]
    public string Status { get; set; } = "pending"; // pending, confirmed, cancelled

    [Column("total_amount")]
    public decimal TotalAmount { get; set; }

    [Column("booked_at")]
    public DateTime BookedAt { get; set; } = DateTime.UtcNow;

    [Column("cancelled_at")]
    public DateTime? CancelledAt { get; set; }

    [MaxLength(200)]
    [Column("contact_email")]
    public string? ContactEmail { get; set; }

    // Navigation properties
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    [ForeignKey("TripId")]
    public Trip Trip { get; set; } = null!;

    public ICollection<BookingPassenger> Passengers { get; set; } = new List<BookingPassenger>();
    public Payment? Payment { get; set; }
}
