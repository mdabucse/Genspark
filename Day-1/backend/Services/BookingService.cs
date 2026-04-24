using BusBooking.API.Data;
using BusBooking.API.DTOs.Booking;
using BusBooking.API.Interfaces;
using BusBooking.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace BusBooking.API.Services;

public class BookingService : IBookingService
{
    private readonly AppDbContext _db;
    private readonly ILogger<BookingService> _logger;
    private readonly IEmailService _emailService;

    public BookingService(AppDbContext db, ILogger<BookingService> logger, IEmailService emailService)
    {
        _db = db;
        _logger = logger;
        _emailService = emailService;
    }

    public async Task<BookingResponseDto> CreateBookingAsync(CreateBookingDto dto, int userId)
    {
        _logger.LogInformation("Creating booking for User {UserId}, ContactEmail: {ContactEmail}", userId, dto.ContactEmail);
        if (!dto.Passengers.Any())
            throw new ArgumentException("At least one passenger is required");

        var seatIds = dto.Passengers.Select(p => p.SeatId).ToArray();
        if (seatIds.Distinct().Count() != seatIds.Length)
            throw new ArgumentException("Duplicate seats are not allowed in one booking");

        using var tx = await _db.Database.BeginTransactionAsync(IsolationLevel.Serializable);

        // 1. Verify all seats are still locked by THIS user
        var locks = await _db.TripSeatStatuses
            .Where(s => s.TripId == dto.TripId && seatIds.Contains(s.SeatId))
            .ToListAsync();

        if (locks.Count != seatIds.Length ||
            locks.Any(l => l.Status != "locked" || l.LockedBy != userId || l.LockedUntil <= DateTime.UtcNow))
            throw new ArgumentException("Seat lock expired or invalid. Please select seats again.");

        // 2. Calculate fare
        var trip = await _db.Trips.Include(t => t.Bus).Include(t => t.Route).FirstOrDefaultAsync(t => t.Id == dto.TripId);
        if (trip == null) throw new KeyNotFoundException("Trip not found");

        var totalFare = trip.BaseFare * dto.Passengers.Count;
        totalFare += totalFare * trip.TaxPercent / 100;

        // 3. Create booking (status = pending)
        var booking = new Booking
        {
            UserId = userId,
            TripId = dto.TripId,
            BookingRef = GenerateBookingRef(),
            TotalAmount = totalFare,
            Status = "pending",
            BookedAt = DateTime.UtcNow,
            ContactEmail = string.IsNullOrWhiteSpace(dto.ContactEmail) ? null : dto.ContactEmail.Trim()
        };

        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();

        // 4. Add passengers
        foreach (var p in dto.Passengers)
        {
            _db.BookingPassengers.Add(new BookingPassenger
            {
                BookingId = booking.Id,
                SeatId = p.SeatId,
                PassengerName = p.Name,
                PassengerAge = p.Age,
                PassengerGender = p.Gender
            });
        }
        await _db.SaveChangesAsync();
        await tx.CommitAsync();

        return new BookingResponseDto
        {
            BookingId = booking.Id,
            BookingRef = booking.BookingRef,
            TotalFare = totalFare,
            Status = booking.Status,
            BookedAt = booking.BookedAt,
            Trip = new TripInfoDto
            {
                BusName = trip.Bus.BusName,
                BusType = trip.Bus.BusType,
                Source = trip.Route.Source,
                Destination = trip.Route.Destination,
                DepartureTime = trip.DepartureTime,
                ArrivalTime = trip.ArrivalTime
            },
            Passengers = dto.Passengers.Select(p =>
            {
                var seat = _db.Seats.Find(p.SeatId);
                return new PassengerInfoDto
                {
                    Name = p.Name,
                    Age = p.Age,
                    Gender = p.Gender,
                    SeatNumber = seat?.SeatNumber ?? "N/A"
                };
            }).ToList()
        };
    }

    public async Task<List<BookingResponseDto>> GetUserBookingsAsync(int userId)
    {
        return await _db.Bookings
            .Include(b => b.Trip).ThenInclude(t => t.Bus)
            .Include(b => b.Trip).ThenInclude(t => t.Route)
            .Include(b => b.Passengers).ThenInclude(p => p.Seat)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.BookedAt)
            .Select(b => new BookingResponseDto
            {
                BookingId = b.Id,
                BookingRef = b.BookingRef,
                TotalFare = b.TotalAmount,
                Status = b.Status,
                BookedAt = b.BookedAt,
                Trip = new TripInfoDto
                {
                    BusName = b.Trip.Bus.BusName,
                    BusType = b.Trip.Bus.BusType,
                    Source = b.Trip.Route.Source,
                    Destination = b.Trip.Route.Destination,
                    DepartureTime = b.Trip.DepartureTime,
                    ArrivalTime = b.Trip.ArrivalTime
                },
                Passengers = b.Passengers.Select(p => new PassengerInfoDto
                {
                    Name = p.PassengerName,
                    Age = p.PassengerAge ?? 0,
                    Gender = p.PassengerGender ?? "",
                    SeatNumber = p.Seat.SeatNumber
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<BookingResponseDto?> GetBookingDetailsAsync(int bookingId, int userId)
    {
        var booking = await _db.Bookings
            .Include(b => b.Trip).ThenInclude(t => t.Bus)
            .Include(b => b.Trip).ThenInclude(t => t.Route)
            .Include(b => b.Passengers).ThenInclude(p => p.Seat)
            .FirstOrDefaultAsync(b => b.Id == bookingId && b.UserId == userId);

        if (booking == null) return null;

        return new BookingResponseDto
        {
            BookingId = booking.Id,
            BookingRef = booking.BookingRef,
            TotalFare = booking.TotalAmount,
            Status = booking.Status,
            BookedAt = booking.BookedAt,
            Trip = new TripInfoDto
            {
                BusName = booking.Trip.Bus.BusName,
                BusType = booking.Trip.Bus.BusType,
                Source = booking.Trip.Route.Source,
                Destination = booking.Trip.Route.Destination,
                DepartureTime = booking.Trip.DepartureTime,
                ArrivalTime = booking.Trip.ArrivalTime
            },
            Passengers = booking.Passengers.Select(p => new PassengerInfoDto
            {
                Name = p.PassengerName,
                Age = p.PassengerAge ?? 0,
                Gender = p.PassengerGender ?? "",
                SeatNumber = p.Seat.SeatNumber
            }).ToList()
        };
    }

    public async Task CancelBookingAsync(int bookingId, int userId)
    {
        var booking = await _db.Bookings
            .Include(b => b.Trip)
            .Include(b => b.Passengers)
            .FirstOrDefaultAsync(b => b.Id == bookingId && b.UserId == userId);

        if (booking == null) throw new KeyNotFoundException("Booking not found");
        if (booking.Status != "confirmed" && booking.Status != "pending")
            throw new ArgumentException("Only pending or confirmed bookings can be cancelled");

        if (booking.Status == "confirmed")
        {
            var quote = await GetCancellationQuoteAsync(bookingId, userId);
            if (!quote.CanCancel)
                throw new ArgumentException(quote.CannotCancelReason ?? "Cancellation window closed");

            booking.RefundAmount = quote.RefundAmount;
            booking.DeductionAmount = quote.DeductionAmount;
        }
        else
        {
            // Pending bookings get full refund (or just cancelled)
            booking.RefundAmount = booking.TotalAmount;
            booking.DeductionAmount = 0;
        }

        booking.Status = "cancelled";
        booking.CancelledAt = DateTime.UtcNow;

        // Release seats back to available
        var seatIds = booking.Passengers.Select(p => p.SeatId).ToArray();
        var seatStatuses = await _db.TripSeatStatuses
            .Where(s => s.TripId == booking.TripId && seatIds.Contains(s.SeatId))
            .ToListAsync();

        foreach (var s in seatStatuses)
        {
            s.Status = "available";
            s.LockedBy = null;
            s.LockedUntil = null;
        }

        await _db.SaveChangesAsync();

        // 3. Update payment status to refunded if it was successful
        var payment = await _db.Payments.FirstOrDefaultAsync(p => p.BookingId == bookingId && p.Status == "success");
        if (payment != null)
        {
            payment.Status = "refunded";
            await _db.SaveChangesAsync();
        }

        // Send cancellation email (fire and forget)
        try
        {
            var recipientEmail = !string.IsNullOrWhiteSpace(booking.ContactEmail)
                ? booking.ContactEmail
                : booking.User.Email;
            
            var firstPassenger = booking.Passengers.FirstOrDefault();
            var recipientName = firstPassenger != null 
                ? firstPassenger.PassengerName 
                : booking.User.Name;

            await _emailService.SendCancellationEmailToAsync(booking, recipientEmail, recipientName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send cancellation email for booking {BookingRef}", booking.BookingRef);
        }
    }

    public async Task<CancellationQuoteDto> GetCancellationQuoteAsync(int bookingId, int userId)
    {
        var booking = await _db.Bookings
            .Include(b => b.Trip)
            .FirstOrDefaultAsync(b => b.Id == bookingId && b.UserId == userId);

        if (booking == null) throw new KeyNotFoundException("Booking not found");

        var hoursLeft = (booking.Trip.DepartureTime - DateTime.UtcNow).TotalHours;
        var quote = new CancellationQuoteDto
        {
            BookingId = bookingId,
            TotalAmount = booking.TotalAmount,
            CanCancel = true
        };

        if (booking.Status == "cancelled")
        {
            quote.CanCancel = false;
            quote.CannotCancelReason = "Booking is already cancelled";
            return quote;
        }

        if (hoursLeft < 2)
        {
            quote.CanCancel = false;
            quote.CannotCancelReason = "Cancellation is not allowed within 2 hours of departure";
            quote.DeductionAmount = booking.TotalAmount;
            quote.RefundAmount = 0;
            quote.CancellationPolicy = "Less than 2 hours: 0% Refund";
        }
        else if (hoursLeft < 12)
        {
            quote.DeductionAmount = booking.TotalAmount * 0.50m;
            quote.RefundAmount = booking.TotalAmount - quote.DeductionAmount;
            quote.CancellationPolicy = "2 to 12 hours: 50% Refund";
        }
        else if (hoursLeft < 24)
        {
            quote.DeductionAmount = booking.TotalAmount * 0.25m;
            quote.RefundAmount = booking.TotalAmount - quote.DeductionAmount;
            quote.CancellationPolicy = "12 to 24 hours: 75% Refund";
        }
        else
        {
            quote.DeductionAmount = booking.TotalAmount * 0.10m;
            quote.RefundAmount = booking.TotalAmount - quote.DeductionAmount;
            quote.CancellationPolicy = "More than 24 hours: 90% Refund";
        }

        return quote;
    }

    private static string GenerateBookingRef()
    {
        return $"BK{DateTime.UtcNow:yyyyMMdd}{Random.Shared.Next(1000, 9999)}";
    }
}
