using System.Data;
using BusBooking.API.Data;
using BusBooking.API.DTOs.Booking;
using BusBooking.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BusBooking.API.Services;

public class SeatService : ISeatService
{
    private readonly AppDbContext _db;

    public SeatService(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Atomically lock seats for a user using Serializable isolation to prevent double-booking.
    /// </summary>
    public async Task<SeatLockResponseDto> LockSeatsAsync(int tripId, int[] seatIds, int userId)
    {
        using var tx = await _db.Database.BeginTransactionAsync(IsolationLevel.Serializable);
        try
        {
            // First, release any expired locks
            var expiredLocks = await _db.TripSeatStatuses
                .Where(s => s.TripId == tripId && s.Status == "locked" && s.LockedUntil < DateTime.UtcNow)
                .ToListAsync();

            foreach (var expired in expiredLocks)
            {
                expired.Status = "available";
                expired.LockedBy = null;
                expired.LockedUntil = null;
            }

            // Get seat statuses for the requested seats
            var statuses = await _db.TripSeatStatuses
                .Where(s => s.TripId == tripId && seatIds.Contains(s.SeatId))
                .ToListAsync();

            if (statuses.Count != seatIds.Length)
                throw new ArgumentException("One or more seats do not exist for this trip");

            // Check all must be available
            var unavailable = statuses
                .Where(s => s.Status != "available")
                .Select(s => s.SeatId)
                .ToList();

            if (unavailable.Any())
                throw new ArgumentException($"Seats {string.Join(", ", unavailable)} are no longer available");

            // Lock all seats
            var lockExpiry = DateTime.UtcNow.AddMinutes(5);
            foreach (var seat in statuses)
            {
                seat.Status = "locked";
                seat.LockedBy = userId;
                seat.LockedUntil = lockExpiry;
            }

            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            return new SeatLockResponseDto
            {
                Success = true,
                LockExpiry = lockExpiry,
                Message = $"{seatIds.Length} seat(s) locked successfully. Complete payment within 5 minutes."
            };
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }
}
