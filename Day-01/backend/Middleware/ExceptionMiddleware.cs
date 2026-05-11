using Microsoft.AspNetCore.Diagnostics;

namespace BusBooking.API.Middleware;

public static class ExceptionMiddlewareExtensions
{
    public static void UseGlobalExceptionHandler(this WebApplication app)
    {
        app.UseExceptionHandler(builder => builder.Run(async ctx =>
        {
            var exception = ctx.Features.Get<IExceptionHandlerFeature>()?.Error;

            ctx.Response.StatusCode = exception switch
            {
                UnauthorizedAccessException => 401,
                KeyNotFoundException => 404,
                ArgumentException => 400,
                _ => 500
            };

            ctx.Response.ContentType = "application/json";
            await ctx.Response.WriteAsJsonAsync(new
            {
                error = exception?.Message ?? "Internal Server Error",
                statusCode = ctx.Response.StatusCode
            });
        }));
    }
}
