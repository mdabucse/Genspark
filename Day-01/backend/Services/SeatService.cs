using System.Data;
using BusBooking.API.Data;
using BusBooking.API.DTOs.Booking;
using BusBooking.API.Interfaces;
using BusBooking.API.Models;
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
            {
                // Some status records are missing (happens if layout changed after scheduling)
                // Verify these seats actually belong to the bus for this trip
                var trip = await _db.Trips.FindAsync(tripId);
                if (trip == null) throw new ArgumentException("Trip not found");

                var missingIds = seatIds.Except(statuses.Select(s => s.SeatId)).ToList();
                var validSeats = await _db.Seats
                    .Where(s => s.BusId == trip.BusId && missingIds.Contains(s.Id))
                    .ToListAsync();

                if (validSeats.Count != missingIds.Count)
                    throw new ArgumentException("One or more seats are invalid for this bus");

                // Create missing status records
                foreach (var seat in validSeats)
                {
                    var newStatus = new TripSeatStatus
                    {
                        TripId = tripId,
                        SeatId = seat.Id,
                        Status = "available"
                    };
                    _db.TripSeatStatuses.Add(newStatus);
                    statuses.Add(newStatus);
                }
                await _db.SaveChangesAsync();
            }

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
