using System.Security.Claims;
using BusBooking.API.DTOs.Payment;
using BusBooking.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusBooking.API.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost("dummy-pay")]
    public async Task<IActionResult> DummyPay([FromBody] DummyPaymentDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _paymentService.ProcessDummyPaymentAsync(dto.BookingId, userId);
        return Ok(result);
    }
}
