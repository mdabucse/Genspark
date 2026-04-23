using System.Security.Claims;
using BusBooking.API.DTOs.Trip;
using BusBooking.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusBooking.API.Controllers;

[ApiController]
[Route("api/trips")]
public class TripController : ControllerBase
{
    private readonly ITripService _tripService;

    public TripController(ITripService tripService)
    {
        _tripService = tripService;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string source,
        [FromQuery] string destination,
        [FromQuery] DateTime date)
    {
        var trips = await _tripService.SearchTripsAsync(source, destination, date);
        return Ok(trips);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var trip = await _tripService.GetTripByIdAsync(id);
        return trip == null ? NotFound(new { error = "Trip not found" }) : Ok(trip);
    }

    [HttpGet("{id}/seats")]
    public async Task<IActionResult> GetSeats(int id)
    {
        var seats = await _tripService.GetTripSeatsAsync(id);
        return Ok(seats);
    }

    [HttpPost]
    [Authorize(Roles = "operator")]
    public async Task<IActionResult> Create([FromBody] CreateTripDto dto)
    {
        var operatorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _tripService.CreateTripAsync(dto, operatorId);
        return CreatedAtAction(nameof(GetSeats), new { id = result.TripId }, result);
    }

    [HttpPut("{id}/cancel")]
    [Authorize(Roles = "operator")]
    public async Task<IActionResult> Cancel(int id)
    {
        var operatorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _tripService.CancelTripAsync(id, operatorId);
        return Ok(new { message = "Trip cancelled successfully" });
    }
}
