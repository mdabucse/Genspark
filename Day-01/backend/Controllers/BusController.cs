using System.Security.Claims;
using BusBooking.API.DTOs.Bus;
using BusBooking.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusBooking.API.Controllers;

[ApiController]
[Route("api/buses")]
public class BusController : ControllerBase
{
    private readonly IBusService _busService;

    public BusController(IBusService busService)
    {
        _busService = busService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var buses = await _busService.GetAllBusesAsync();
        return Ok(buses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var bus = await _busService.GetBusByIdAsync(id);
        return bus == null ? NotFound() : Ok(bus);
    }

    [HttpPost]
    [Authorize(Roles = "operator")]
    public async Task<IActionResult> Create([FromBody] CreateBusDto dto)
    {
        var operatorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _busService.CreateBusAsync(dto, operatorId);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "operator")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBusDto dto)
    {
        var operatorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _busService.UpdateBusAsync(id, dto, operatorId);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "operator")]
    public async Task<IActionResult> Delete(int id)
    {
        var operatorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _busService.DeleteBusAsync(id, operatorId);
        return NoContent();
    }

    [HttpGet("operator/my-buses")]
    [Authorize(Roles = "operator")]
    public async Task<IActionResult> GetMyBuses()
    {
        var operatorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var buses = await _busService.GetOperatorBusesAsync(operatorId);
        return Ok(buses);
    }

    [HttpPost("{id}/toggle-status")]
    [Authorize(Roles = "operator")]
    public async Task<IActionResult> ToggleStatus(int id)
    {
        var operatorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _busService.ToggleBusStatusAsync(id, operatorId);
        return Ok(result);
    }
}
