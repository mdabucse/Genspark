using System.Security.Claims;
using BusBooking.API.DTOs.Booking;
using BusBooking.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusBooking.API.Controllers;

[ApiController]
[Route("api/seats")]
public class SeatController : ControllerBase
{
    private readonly ISeatService _seatService;

    public SeatController(ISeatService seatService)
    {
        _seatService = seatService;
    }

    [HttpPost("lock")]
    [Authorize]
    public async Task<IActionResult> LockSeats([FromBody] SeatLockDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _seatService.LockSeatsAsync(dto.TripId, dto.SeatIds, userId);
        return Ok(result);
    }
}
