namespace BusBooking.API.DTOs.Payment;

public class DummyPaymentDto
{
    public int BookingId { get; set; }
}

public class PaymentResponseDto
{
    public bool Success { get; set; }
    public string BookingRef { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Message { get; set; } = string.Empty;
}
