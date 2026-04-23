using BusBooking.API.DTOs.Booking;

namespace BusBooking.API.Interfaces;

public interface ISeatService
{
    Task<SeatLockResponseDto> LockSeatsAsync(int tripId, int[] seatIds, int userId);
}

public interface IBookingService
{
    Task<BookingResponseDto> CreateBookingAsync(CreateBookingDto dto, int userId);
    Task<List<BookingResponseDto>> GetUserBookingsAsync(int userId);
    Task<BookingResponseDto?> GetBookingDetailsAsync(int bookingId, int userId);
    Task CancelBookingAsync(int bookingId, int userId);
}
