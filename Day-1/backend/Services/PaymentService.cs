using BusBooking.API.Data;
using BusBooking.API.DTOs.Payment;
using BusBooking.API.Interfaces;
using BusBooking.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace BusBooking.API.Services;

public class PaymentService : IPaymentService
{
    private readonly AppDbContext _db;
    private readonly IEmailService _emailService;
    private readonly ILogger<PaymentService> _logger;

    public PaymentService(AppDbContext db, IEmailService emailService, ILogger<PaymentService> logger)
    {
        _db = db;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<PaymentResponseDto> ProcessDummyPaymentAsync(int bookingId, int userId)
    {
        using var tx = await _db.Database.BeginTransactionAsync(IsolationLevel.Serializable);

        var booking = await _db.Bookings
            .Include(b => b.User)
            .Include(b => b.Trip).ThenInclude(t => t.Bus)
            .Include(b => b.Trip).ThenInclude(t => t.Route)
            .Include(b => b.Passengers)
            .FirstOrDefaultAsync(b => b.Id == bookingId);

        if (booking == null)
            throw new KeyNotFoundException("Booking not found");
        if (booking.UserId != userId)
            throw new UnauthorizedAccessException("You can only pay for your own bookings");
        if (booking.Status != "pending")
            throw new ArgumentException("Booking is not in pending state");

        // Re-verify seats are still locked by this user
        var seatIds = booking.Passengers.Select(p => p.SeatId).ToArray();
        var seatStatuses = await _db.TripSeatStatuses
            .Where(s => s.TripId == booking.TripId && seatIds.Contains(s.SeatId))
            .ToListAsync();

        if (seatStatuses.Count != seatIds.Length ||
            seatStatuses.Any(s => s.Status != "locked" || s.LockedBy != userId || s.LockedUntil <= DateTime.UtcNow))
            throw new ArgumentException("Seat lock expired. Please rebook.");

        // Create payment record
        var payment = new Payment
        {
            BookingId = bookingId,
            Amount = booking.TotalAmount,
            Gateway = "dummy",
            TransactionId = Guid.NewGuid().ToString(),
            Status = "success",
            PaidAt = DateTime.UtcNow
        };
        _db.Payments.Add(payment);

        // Confirm booking
        booking.Status = "confirmed";

        // Mark all seats as booked
        foreach (var s in seatStatuses)
        {
            s.Status = "booked";
            s.LockedBy = null;
            s.LockedUntil = null;
        }

        await _db.SaveChangesAsync();
        await tx.CommitAsync();

        // Send confirmation email (fire and forget)
        try
        {
            // Use the contact email provided at booking time, else fall back to user's registered email
            var recipientEmail = !string.IsNullOrWhiteSpace(booking.ContactEmail)
                ? booking.ContactEmail
                : booking.User.Email;
            
            // Use the first passenger's name for personalization, fallback to account name
            var firstPassenger = booking.Passengers.FirstOrDefault();
            var recipientName = firstPassenger != null 
                ? firstPassenger.PassengerName 
                : booking.User.Name;

            await _emailService.SendBookingConfirmationToAsync(booking, recipientEmail, recipientName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send confirmation email for booking {BookingRef}", booking.BookingRef);
        }

        return new PaymentResponseDto
        {
            Success = true,
            BookingRef = booking.BookingRef,
            TransactionId = payment.TransactionId,
            Amount = payment.Amount,
            Message = "Payment successful! Booking confirmed."
        };
    }
}
