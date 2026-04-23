using BusBooking.API.DTOs.Payment;

namespace BusBooking.API.Interfaces;

public interface IPaymentService
{
    Task<PaymentResponseDto> ProcessDummyPaymentAsync(int bookingId, int userId);
}
