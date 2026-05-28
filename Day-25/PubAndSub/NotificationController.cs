using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    [HttpPost]
    public IActionResult PublishMessage(string message)
    {
        EventBus.Publish(message);

        return Ok("Message Published");
    }
}