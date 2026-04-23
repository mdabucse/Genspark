using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusBooking.API.Models;

[Table("booking_passengers")]
public class BookingPassenger
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("booking_id")]
    public int BookingId { get; set; }

    [Column("seat_id")]
    public int SeatId { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("passenger_name")]
    public string PassengerName { get; set; } = string.Empty;

    [Column("passenger_age")]
    public int? PassengerAge { get; set; }

    [MaxLength(10)]
    [Column("passenger_gender")]
    public string? PassengerGender { get; set; }

    // Navigation properties
    [ForeignKey("BookingId")]
    public Booking Booking { get; set; } = null!;

    [ForeignKey("SeatId")]
    public Seat Seat { get; set; } = null!;
}
