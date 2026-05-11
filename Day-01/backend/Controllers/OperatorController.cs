using System.Security.Claims;
using BusBooking.API.Data;
using BusBooking.API.DTOs.Bus;
using BusBooking.API.DTOs.Trip;
using BusBooking.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BusBooking.API.Controllers;

[ApiController]
[Route("api/operator")]
[Authorize(Roles = "operator")]
public class OperatorController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IBusService _busService;
    private readonly ITripService _tripService;

    public OperatorController(AppDbContext db, IBusService busService, ITripService tripService)
    {
        _db = db;
        _busService = busService;
        _tripService = tripService;
    }

    private int GetOperatorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("buses")]
    public async Task<IActionResult> GetMyBuses()
    {
        var buses = await _busService.GetOperatorBusesAsync(GetOperatorId());
        return Ok(buses);
    }

    [HttpPost("buses")]
    public async Task<IActionResult> AddBus([FromBody] CreateBusDto dto)
    {
        var result = await _busService.CreateBusAsync(dto, GetOperatorId());
        return Ok(result);
    }

    [HttpPut("buses/{id}")]
    public async Task<IActionResult> EditBus(int id, [FromBody] UpdateBusDto dto)
    {
        var result = await _busService.UpdateBusAsync(id, dto, GetOperatorId());
        return Ok(result);
    }

    [HttpPut("buses/{id}/block")]
    public async Task<IActionResult> BlockBus(int id)
    {
        var result = await _busService.ToggleBusStatusAsync(id, GetOperatorId());
        return Ok(new { message = result.IsActive ? "Bus unblocked" : "Bus blocked", result });
    }

    [HttpPut("buses/{id}/unblock")]
    public async Task<IActionResult> UnblockBus(int id)
    {
        var result = await _busService.ToggleBusStatusAsync(id, GetOperatorId());
        return Ok(new { message = "Bus unblocked", result });
    }

    [HttpPut("buses/{id}/layout")]
    public async Task<IActionResult> SaveLayout(int id, [FromBody] UpdateBusLayoutDto dto)
    {
        var result = await _busService.UpdateBusLayoutAsync(id, dto, GetOperatorId());
        return Ok(new { message = "Bus layout saved successfully", result });
    }

    [HttpGet("trips")]
    public async Task<IActionResult> GetMyTrips()
    {
        var operatorId = GetOperatorId();
        var trips = await _db.Trips
            .Include(t => t.Bus)
            .Include(t => t.Route)
            .Where(t => t.Bus.OperatorId == operatorId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new
            {
                t.Id,
                BusName = t.Bus.BusName,
                Route = t.Route.Source + " → " + t.Route.Destination,
                t.DepartureTime, t.ArrivalTime,
                t.BaseFare, t.TaxPercent, t.Status,
                BookedSeats = t.TripSeatStatuses.Count(ss => ss.Status == "booked"),
                TotalSeats = t.Bus.Capacity
            })
            .ToListAsync();
        return Ok(trips);
    }

    [HttpPost("trips")]
    public async Task<IActionResult> ScheduleTrip([FromBody] CreateTripDto dto)
    {
        var result = await _tripService.CreateTripAsync(dto, GetOperatorId());
        return Ok(result);
    }

    [HttpPut("trips/{id}/pricing")]
    public async Task<IActionResult> UpdatePricing(int id, [FromBody] decimal baseFare)
    {
        var trip = await _db.Trips.Include(t => t.Bus).FirstOrDefaultAsync(t => t.Id == id);
        if (trip == null) return NotFound();
        if (trip.Bus.OperatorId != GetOperatorId()) return Forbid();

        trip.BaseFare = baseFare;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Pricing updated", trip.BaseFare });
    }

    [HttpGet("bookings")]
    public async Task<IActionResult> GetMyBookings(
        [FromQuery] DateTime? date,
        [FromQuery] int? busId,
        [FromQuery] string? status)
    {
        var operatorId = GetOperatorId();
        var query = _db.Bookings
            .Include(b => b.User)
            .Include(b => b.Trip).ThenInclude(t => t.Bus)
            .Include(b => b.Trip).ThenInclude(t => t.Route)
            .Include(b => b.Passengers).ThenInclude(p => p.Seat)
            .Where(b => b.Trip.Bus.OperatorId == operatorId);

        if (date.HasValue)
            query = query.Where(b => b.Trip.DepartureTime.Date == date.Value.Date);
        if (busId.HasValue)
            query = query.Where(b => b.Trip.BusId == busId.Value);
        if (!string.IsNullOrEmpty(status))
            query = query.Where(b => b.Status == status);

        var bookings = await query
            .OrderByDescending(b => b.BookedAt)
            .Select(b => new
            {
                b.Id, b.BookingRef, b.Status, b.TotalAmount, b.BookedAt,
                UserName = b.User.Name,
                BusName = b.Trip.Bus.BusName,
                Route = b.Trip.Route.Source + " → " + b.Trip.Route.Destination,
                DepartureTime = b.Trip.DepartureTime,
                Passengers = b.Passengers.Select(p => new
                {
                    p.PassengerName, p.PassengerAge, p.PassengerGender,
                    SeatNumber = p.Seat.SeatNumber
                })
            })
            .ToListAsync();

        return Ok(bookings);
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var operatorId = GetOperatorId();

        var totalBuses = await _db.Buses.CountAsync(b => b.OperatorId == operatorId);
        var activeTrips = await _db.Trips
            .CountAsync(t => t.Bus.OperatorId == operatorId && t.Status == "scheduled" && t.DepartureTime > DateTime.UtcNow);
        var todayBookings = await _db.Bookings
            .CountAsync(b => b.Trip.Bus.OperatorId == operatorId && b.BookedAt.Date == DateTime.UtcNow.Date && b.Status != "cancelled");
        var successRevenue = await _db.Payments
            .Where(p => p.Status == "success" && p.Booking.Trip.Bus.OperatorId == operatorId)
            .SumAsync(p => p.Amount);
        var cancellationFees = await _db.Bookings
            .Where(b => b.Status == "cancelled" && b.Trip.Bus.OperatorId == operatorId)
            .SumAsync(b => b.DeductionAmount);
        var totalRevenue = successRevenue + cancellationFees;

        return Ok(new { totalBuses, activeTrips, todayBookings, totalRevenue });
    }
}
