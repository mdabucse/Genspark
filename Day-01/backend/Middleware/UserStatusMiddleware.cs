using System.Security.Claims;
using BusBooking.API.Data;
using Microsoft.EntityFrameworkCore;

namespace BusBooking.API.Middleware;

public class UserStatusMiddleware
{
    private readonly RequestDelegate _next;

    public UserStatusMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext db)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var userIdStr = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdStr, out var userId))
            {
                var user = await db.Users
                    .AsNoTracking()
                    .Select(u => new { u.Id, u.IsActive })
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null || !user.IsActive)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    await context.Response.WriteAsJsonAsync(new { error = "Account is inactive or blocked. Access denied." });
                    return;
                }
            }
        }

        await _next(context);
    }
}

public static class UserStatusMiddlewareExtensions
{
    public static IApplicationBuilder UseUserStatusCheck(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<UserStatusMiddleware>();
    }
}
