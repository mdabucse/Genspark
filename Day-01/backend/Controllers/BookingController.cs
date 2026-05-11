using System.Security.Claims;
using BusBooking.API.DTOs.Booking;
using BusBooking.API.Helpers;
using BusBooking.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusBooking.API.Controllers;

[ApiController]
[Route("api/bookings")]
[Authorize]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _bookingService.CreateBookingAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = result.BookingId }, result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var bookings = await _bookingService.GetUserBookingsAsync(userId);
        return Ok(bookings);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var booking = await _bookingService.GetBookingDetailsAsync(id, userId);
        return booking == null ? NotFound() : Ok(booking);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Cancel(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _bookingService.CancelBookingAsync(id, userId);
        return Ok(new { message = "Booking cancelled successfully" });
    }

    [HttpGet("{id}/cancellation-quote")]
    public async Task<IActionResult> GetCancellationQuote(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var quote = await _bookingService.GetCancellationQuoteAsync(id, userId);
        return Ok(quote);
    }

    [HttpGet("{bookingId}/ticket")]
    public async Task<IActionResult> DownloadTicket(int bookingId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var booking = await _bookingService.GetBookingDetailsAsync(bookingId, userId);
        if (booking == null) return NotFound();
        if (booking.Status != "confirmed")
            return BadRequest(new { error = "Ticket is available only for confirmed bookings" });

        var pdf = TicketPdfGenerator.Generate(booking);
        return File(pdf, "application/pdf", $"{booking.BookingRef}.pdf");
    }
}
