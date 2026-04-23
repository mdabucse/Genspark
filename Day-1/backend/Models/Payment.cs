using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusBooking.API.Models;

[Table("payments")]
public class Payment
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("booking_id")]
    public int BookingId { get; set; }

    [Column("amount")]
    public decimal Amount { get; set; }

    [MaxLength(30)]
    [Column("gateway")]
    public string Gateway { get; set; } = string.Empty; // razorpay, stripe, dummy

    [MaxLength(100)]
    [Column("transaction_id")]
    public string? TransactionId { get; set; }

    [MaxLength(20)]
    [Column("status")]
    public string Status { get; set; } = "pending"; // success, failed, pending, refunded

    [Column("paid_at")]
    public DateTime? PaidAt { get; set; }

    // Navigation properties
    [ForeignKey("BookingId")]
    public Booking Booking { get; set; } = null!;
}
