using BusBooking.API.Data;
using BusBooking.API.DTOs.Trip;
using BusBooking.API.Interfaces;
using BusBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BusBooking.API.Services;


public class TripService : ITripService
{
    private readonly AppDbContext _db;
    private readonly IEmailService _emailService;

    public TripService(AppDbContext db, IEmailService emailService)
    {
        _db = db;
        _emailService = emailService;
    }

    public async Task<List<TripResponseDto>> SearchTripsAsync(string source, string destination, DateTime date)
    {
        // Get trips for the route on the specified date
        var trips = await _db.Trips
            .Include(t => t.Bus)
                .ThenInclude(b => b.Operator)
            .Include(t => t.Route)
            .Where(t =>
                t.Route != null &&
                t.Bus != null &&
                t.Bus.Operator != null &&
                t.Route.Source.ToLower() == source.ToLower() &&
                t.Route.Destination.ToLower() == destination.ToLower() &&
                t.DepartureTime >= date.Date && 
                t.DepartureTime < date.Date.AddDays(1) &&
                t.Status == "scheduled" &&
                t.Bus.IsActive &&
                t.Bus.Operator.IsActive)
            .Select(t => new TripResponseDto
            {
                TripId = t.Id,
                BusName = t.Bus.BusName,
                BusType = t.Bus.BusType,
                SeatLayout = t.Bus.SeatLayout,
                OperatorName = t.Bus.Operator.Name,
                Source = t.Route.Source,
                Destination = t.Route.Destination,
                DepartureTime = t.DepartureTime,
                ArrivalTime = t.ArrivalTime,
                BaseFare = t.BaseFare,
                TaxPercent = t.TaxPercent,
                TotalFare = t.BaseFare + (t.BaseFare * t.TaxPercent / 100),
                TotalSeats = t.Bus.Capacity,
                AvailableSeats = t.Bus.Capacity - _db.TripSeatStatuses
                    .Count(ss => ss.TripId == t.Id && (ss.Status == "booked" || ss.Status == "locked")),
                Status = t.Status
            })
            .ToListAsync();

        // If no trips found, check if route exists
        if (trips.Count == 0)
        {
            var routeExists = await _db.Routes
                .Where(r => r.Source.ToLower() == source.ToLower() && 
                            r.Destination.ToLower() == destination.ToLower())
                .FirstOrDefaultAsync();

            // If route exists but no trips, return a placeholder indicating route is available
            if (routeExists != null)
            {
                trips.Add(new TripResponseDto
                {
                    TripId = 0, // 0 indicates this is a route without trips
                    BusName = "Route Available - No Buses Scheduled",
                    BusType = "N/A",
                    OperatorName = "Multiple Operators",
                    Source = routeExists.Source,
                    Destination = routeExists.Destination,
                    Status = "no_trips",
                    DepartureTime = date,
                    ArrivalTime = date.AddHours(1),
                    TotalFare = 0,
                    AvailableSeats = 0,
                    TotalSeats = 0
                });
            }
        }

        return trips;
    }

    public async Task<TripResponseDto?> GetTripByIdAsync(int tripId)
    {
        return await _db.Trips
            .Include(t => t.Bus)
                .ThenInclude(b => b.Operator)
            .Include(t => t.Route)
            .Where(t => t.Id == tripId)
            .Select(t => new TripResponseDto
            {
                TripId = t.Id,
                BusName = t.Bus.BusName,
                BusType = t.Bus.BusType,
                SeatLayout = t.Bus.SeatLayout,
                OperatorName = t.Bus.Operator.Name,
                Source = t.Route.Source,
                Destination = t.Route.Destination,
                DepartureTime = t.DepartureTime,
                ArrivalTime = t.ArrivalTime,
                BaseFare = t.BaseFare,
                TaxPercent = t.TaxPercent,
                TotalFare = t.BaseFare + (t.BaseFare * t.TaxPercent / 100),
                TotalSeats = t.Bus.Capacity,
                AvailableSeats = t.Bus.Capacity - _db.TripSeatStatuses
                    .Count(ss => ss.TripId == t.Id && (ss.Status == "booked" || ss.Status == "locked")),
                Status = t.Status
            })
            .FirstOrDefaultAsync();
    }

    public async Task<List<SeatStatusDto>> GetTripSeatsAsync(int tripId)
    {
        var trip = await _db.Trips.Include(t => t.Bus).FirstOrDefaultAsync(t => t.Id == tripId);
        if (trip == null)
            throw new KeyNotFoundException("Trip not found");

        // Get all seats for the bus
        var seats = await _db.Seats
            .Where(s => s.BusId == trip.BusId && s.IsActive)
            .ToListAsync();

        // Get existing seat statuses for this trip
        var seatStatuses = await _db.TripSeatStatuses
            .Where(ss => ss.TripId == tripId)
            .ToListAsync();

        // Build response
        var result = seats.Select(seat =>
        {
            var status = seatStatuses.FirstOrDefault(ss => ss.SeatId == seat.Id);
            
            // Check if lock has expired
            string seatStatus = "available";
            if (status != null)
            {
                if (status.Status == "locked" && status.LockedUntil < DateTime.UtcNow)
                    seatStatus = "available"; // Lock expired
                else
                    seatStatus = status.Status;
            }

            return new SeatStatusDto
            {
                SeatId = seat.Id,
                SeatNumber = seat.SeatNumber,
                SeatType = seat.SeatType,
                Status = seatStatus
            };
        }).ToList();

        return result;
    }

    public async Task<TripResponseDto> CreateTripAsync(CreateTripDto dto, int operatorId)
    {
        // Verify the bus belongs to this operator
        var bus = await _db.Buses.FirstOrDefaultAsync(b => b.Id == dto.BusId && b.OperatorId == operatorId);
        if (bus == null)
            throw new UnauthorizedAccessException("Bus not found or doesn't belong to you");

        var route = await _db.Routes.FindAsync(dto.RouteId);
        if (route == null)
            throw new KeyNotFoundException("Route not found");

        var trip = new Trip
        {
            BusId = dto.BusId,
            RouteId = dto.RouteId,
            DepartureTime = dto.DepartureTime,
            ArrivalTime = dto.ArrivalTime,
            BaseFare = dto.BaseFare,
            TaxPercent = dto.TaxPercent,
            Status = "scheduled"
        };

        _db.Trips.Add(trip);
        await _db.SaveChangesAsync();

        // Auto-create TripSeatStatus for all seats on this bus
        var seats = await _db.Seats.Where(s => s.BusId == dto.BusId && s.IsActive).ToListAsync();
        var seatStatuses = seats.Select(s => new TripSeatStatus
        {
            TripId = trip.Id,
            SeatId = s.Id,
            Status = "available"
        }).ToList();

        _db.TripSeatStatuses.AddRange(seatStatuses);
        await _db.SaveChangesAsync();

        return new TripResponseDto
        {
            TripId = trip.Id,
            BusName = bus.BusName,
            BusType = bus.BusType,
            SeatLayout = bus.SeatLayout,
            Source = route.Source,
            Destination = route.Destination,
            DepartureTime = trip.DepartureTime,
            ArrivalTime = trip.ArrivalTime,
            BaseFare = trip.BaseFare,
            TaxPercent = trip.TaxPercent,
            TotalFare = trip.BaseFare + (trip.BaseFare * trip.TaxPercent / 100),
            AvailableSeats = bus.Capacity,
            TotalSeats = bus.Capacity,
            Status = trip.Status
        };
    }

    public async Task<bool> CancelTripAsync(int tripId, int operatorId)
    {
        var trip = await _db.Trips.Include(t => t.Bus).FirstOrDefaultAsync(t => t.Id == tripId);
        if (trip == null)
            throw new KeyNotFoundException("Trip not found");
        if (trip.Bus.OperatorId != operatorId)
            throw new UnauthorizedAccessException("You can only cancel your own trips");

        trip.Status = "cancelled";
        
        // Release all seat locks
        var seatStatuses = await _db.TripSeatStatuses.Where(ss => ss.TripId == tripId).ToListAsync();
        foreach (var ss in seatStatuses)
        {
            ss.Status = "available";
            ss.LockedBy = null;
            ss.LockedUntil = null;
        }

        // Auto-cancel all confirmed/pending bookings for this trip
        var bookings = await _db.Bookings
            .Include(b => b.User)
            .Include(b => b.Trip).ThenInclude(t => t.Bus)
            .Include(b => b.Trip).ThenInclude(t => t.Route)
            .Include(b => b.Passengers)
            .Where(b => b.TripId == tripId && (b.Status == "confirmed" || b.Status == "pending"))
            .ToListAsync();

        foreach (var booking in bookings)
        {
            booking.Status = "cancelled";
            booking.CancelledAt = DateTime.UtcNow;

            // Send cancellation email (fire and forget)
            try { await _emailService.SendCancellationEmailAsync(booking); }
            catch { /* Log but don't fail */ }
        }

        await _db.SaveChangesAsync();
        return true;
    }
}
