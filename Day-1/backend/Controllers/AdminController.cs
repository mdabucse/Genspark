using BusBooking.API.Data;
using BusBooking.API.DTOs.Trip;
using BusBooking.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BusBooking.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IEmailService _emailService;

    public AdminController(AppDbContext db, IEmailService emailService)
    {
        _db = db;
        _emailService = emailService;
    }

    [HttpGet("operators")]
    public async Task<IActionResult> GetOperators()
    {
        var operators = await _db.Users
            .Where(u => u.Role == "operator")
            .Select(u => new
            {
                u.Id, u.Name, u.Email, u.Phone,
                u.IsActive, u.IsVerified, u.CreatedAt,
                BusCount = u.Buses.Count
            })
            .ToListAsync();
        return Ok(operators);
    }

    [HttpPut("operators/{id}/approve")]
    public async Task<IActionResult> ApproveOperator(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null || user.Role != "operator")
            return NotFound(new { error = "Operator not found" });

        user.IsActive = true;
        user.IsVerified = true;
        await _db.SaveChangesAsync();

        try { await _emailService.SendOperatorApprovalEmailAsync(user); }
        catch { /* Log but don't fail */ }

        return Ok(new { message = "Operator approved" });
    }

    [HttpPut("operators/{id}/reject")]
    public async Task<IActionResult> RejectOperator(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null || user.Role != "operator")
            return NotFound(new { error = "Operator not found" });

        user.IsActive = false;
        user.IsVerified = false;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Operator rejected" });
    }

    [HttpPut("operators/{id}/block")]
    public async Task<IActionResult> BlockOperator(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null || user.Role != "operator")
            return NotFound(new { error = "Operator not found" });

        user.IsActive = false;

        // Cancel all future scheduled trips for this operator's buses
        var futureTrips = await _db.Trips
            .Include(t => t.Bus)
            .Where(t => t.Bus.OperatorId == id && t.Status == "scheduled" && t.DepartureTime > DateTime.UtcNow)
            .ToListAsync();

        foreach (var trip in futureTrips)
        {
            trip.Status = "cancelled";

            // Release all seat locks for this trip
            var seatStatuses = await _db.TripSeatStatuses.Where(ss => ss.TripId == trip.Id).ToListAsync();
            foreach (var ss in seatStatuses)
            {
                ss.Status = "available";
                ss.LockedBy = null;
                ss.LockedUntil = null;
            }

            // Cancel all bookings on this trip and notify passengers
            var bookings = await _db.Bookings
                .Include(b => b.User)
                .Include(b => b.Trip).ThenInclude(t => t.Route)
                .Where(b => b.TripId == trip.Id && (b.Status == "confirmed" || b.Status == "pending"))
                .ToListAsync();

            foreach (var booking in bookings)
            {
                booking.Status = "cancelled";
                booking.CancelledAt = DateTime.UtcNow;

                try { await _emailService.SendCancellationEmailAsync(booking); }
                catch { /* Log but don't fail */ }
            }
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Operator blocked", cancelledTrips = futureTrips.Count });
    }

    [HttpPut("operators/{id}/unblock")]
    public async Task<IActionResult> UnblockOperator(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null || user.Role != "operator")
            return NotFound(new { error = "Operator not found" });

        user.IsActive = true;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Operator unblocked" });
    }

    [HttpGet("bookings")]
    public async Task<IActionResult> GetAllBookings(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _db.Bookings
            .Include(b => b.User)
            .Include(b => b.Trip).ThenInclude(t => t.Bus)
            .Include(b => b.Trip).ThenInclude(t => t.Route)
            .OrderByDescending(b => b.BookedAt);

        var total = await query.CountAsync();
        var bookings = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(b => new
            {
                b.Id, b.BookingRef, b.Status, b.TotalAmount, b.BookedAt,
                UserName = b.User.Name,
                UserEmail = b.User.Email,
                BusName = b.Trip.Bus.BusName,
                Route = b.Trip.Route.Source + " → " + b.Trip.Route.Destination,
                DepartureTime = b.Trip.DepartureTime
            })
            .ToListAsync();

        return Ok(new { total, page, pageSize, bookings });
    }

    [HttpGet("reports/daily")]
    public async Task<IActionResult> DailyReport([FromQuery] DateTime? date)
    {
        var targetDate = date?.Date ?? DateTime.UtcNow.Date;

        var bookingsCount = await _db.Bookings
            .Where(b => b.BookedAt.Date == targetDate)
            .CountAsync();

        var revenue = await _db.Payments
            .Where(p => p.Status == "success" && p.PaidAt.HasValue && p.PaidAt.Value.Date == targetDate)
            .SumAsync(p => p.Amount);

        var cancelledCount = await _db.Bookings
            .Where(b => b.CancelledAt.HasValue && b.CancelledAt.Value.Date == targetDate)
            .CountAsync();

        return Ok(new
        {
            date = targetDate,
            totalBookings = bookingsCount,
            totalRevenue = revenue,
            cancelledBookings = cancelledCount
        });
    }

    [HttpGet("reports/revenue-by-operator")]
    public async Task<IActionResult> RevenueByOperator()
    {
        var report = await _db.Payments
            .Where(p => p.Status == "success")
            .Include(p => p.Booking).ThenInclude(b => b.Trip).ThenInclude(t => t.Bus).ThenInclude(b => b.Operator)
            .GroupBy(p => new { p.Booking.Trip.Bus.Operator.Id, p.Booking.Trip.Bus.Operator.Name })
            .Select(g => new
            {
                OperatorId = g.Key.Id,
                OperatorName = g.Key.Name,
                TotalRevenue = g.Sum(p => p.Amount),
                BookingCount = g.Count()
            })
            .ToListAsync();

        return Ok(report);
    }

    [HttpGet("reports/seat-occupancy")]
    public async Task<IActionResult> SeatOccupancy()
    {
        var stats = await _db.Trips
            .Where(t => t.Status != "cancelled")
            .Select(t => new
            {
                t.Id,
                TotalSeats = t.Bus.Capacity,
                BookedSeats = t.TripSeatStatuses.Count(ss => ss.Status == "booked")
            })
            .ToListAsync();

        var avgOccupancy = stats.Any()
            ? stats.Average(s => (double)s.BookedSeats / s.TotalSeats * 100)
            : 0;

        return Ok(new { averageOccupancyPercent = Math.Round(avgOccupancy, 2), tripCount = stats.Count });
    }

    [HttpGet("routes")]
    public async Task<IActionResult> GetRoutes()
    {
        var routes = await _db.Routes
            .Select(r => new
            {
                r.Id, r.Source, r.Destination, r.DistanceKm,
                TripCount = r.Trips.Count,
                r.CreatedAt
            })
            .ToListAsync();
        return Ok(routes);
    }

    [HttpPost("routes")]
    public async Task<IActionResult> CreateRoute([FromBody] CreateRouteDto dto)
    {
        var route = new Models.Route
        {
            Source = dto.Source,
            Destination = dto.Destination,
            DistanceKm = dto.DistanceKm
        };
        _db.Routes.Add(route);
        await _db.SaveChangesAsync();
        return Ok(new { route.Id, route.Source, route.Destination, route.DistanceKm });
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var totalUsers = await _db.Users.CountAsync(u => u.Role == "customer");
        var totalOperators = await _db.Users.CountAsync(u => u.Role == "operator");
        var pendingOperators = await _db.Users.CountAsync(u => u.Role == "operator" && !u.IsActive);
        var tripsToday = await _db.Trips.CountAsync(t => t.DepartureTime.Date == DateTime.UtcNow.Date);
        var totalRevenue = await _db.Payments.Where(p => p.Status == "success").SumAsync(p => p.Amount);
        var todayRevenue = await _db.Payments
            .Where(p => p.Status == "success" && p.PaidAt.HasValue && p.PaidAt.Value.Date == DateTime.UtcNow.Date)
            .SumAsync(p => p.Amount);

        return Ok(new
        {
            totalUsers, totalOperators, pendingOperators,
            tripsToday, totalRevenue, todayRevenue
        });
    }
}
