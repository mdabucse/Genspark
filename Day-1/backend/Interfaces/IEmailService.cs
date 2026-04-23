using BusBooking.API.Models;

namespace BusBooking.API.Interfaces;

public interface IEmailService
{
    Task SendBookingConfirmationAsync(Booking booking);
    Task SendBookingConfirmationToAsync(Booking booking, string recipientEmail, string recipientName);
    Task SendCancellationEmailAsync(Booking booking);
    Task SendCancellationEmailToAsync(Booking booking, string recipientEmail, string recipientName);
    Task SendOperatorApprovalEmailAsync(User user);
}
