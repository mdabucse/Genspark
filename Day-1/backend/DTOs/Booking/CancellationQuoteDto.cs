namespace BusBooking.API.DTOs.Booking;

public class CancellationQuoteDto
{
    public int BookingId { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal RefundAmount { get; set; }
    public decimal DeductionAmount { get; set; }
    public string CancellationPolicy { get; set; } = string.Empty;
    public bool CanCancel { get; set; }
    public string? CannotCancelReason { get; set; }
}
