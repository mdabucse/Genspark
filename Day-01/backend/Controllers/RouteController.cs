using BusBooking.API.DTOs.Trip;
using BusBooking.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusBooking.API.Controllers;

[ApiController]
[Route("api/routes")]
public class RouteController : ControllerBase
{
    private readonly IRouteService _routeService;

    public RouteController(IRouteService routeService)
    {
        _routeService = routeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var routes = await _routeService.GetAllRoutesAsync();
        return Ok(routes);
    }

    [HttpGet("sources")]
    public async Task<IActionResult> GetSources([FromQuery] string? query)
    {
        var sources = await _routeService.GetSourcesAsync(query);
        return Ok(sources);
    }

    [HttpGet("destinations")]
    public async Task<IActionResult> GetDestinations(
        [FromQuery] string? source,
        [FromQuery] string? query)
    {
        var destinations = await _routeService.GetDestinationsAsync(source, query);
        return Ok(destinations);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CreateRouteDto dto)
    {
        var result = await _routeService.CreateRouteAsync(dto);
        return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateRouteDto dto)
    {
        var result = await _routeService.UpdateRouteAsync(id, dto);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _routeService.DeleteRouteAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/boarding-points")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> AddBoardingPoint(int id, [FromBody] CreateBoardingPointDto dto)
    {
        await _routeService.AddBoardingPointAsync(id, dto);
        return Ok(new { message = "Boarding point added" });
    }

    [HttpGet("{id}/boarding-points")]
    public async Task<IActionResult> GetBoardingPoints(int id)
    {
        var points = await _routeService.GetBoardingPointsAsync(id);
        return Ok(points);
    }
}
