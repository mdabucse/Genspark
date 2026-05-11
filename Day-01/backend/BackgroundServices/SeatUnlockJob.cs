using BusBooking.API.Data;
using Microsoft.EntityFrameworkCore;

namespace BusBooking.API.BackgroundServices;

/// <summary>
/// Background service that runs every 60 seconds to release expired seat locks.
/// </summary>
public class SeatUnlockJob : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<SeatUnlockJob> _logger;

    public SeatUnlockJob(IServiceScopeFactory scopeFactory, ILogger<SeatUnlockJob> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("SeatUnlockJob started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);

                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var expired = await db.TripSeatStatuses
                    .Where(s => s.Status == "locked" && s.LockedUntil < DateTime.UtcNow)
                    .ToListAsync(stoppingToken);

                if (expired.Any())
                {
                    foreach (var s in expired)
                    {
                        s.Status = "available";
                        s.LockedBy = null;
                        s.LockedUntil = null;
                    }

                    await db.SaveChangesAsync(stoppingToken);
                    _logger.LogInformation("Released {Count} expired seat locks", expired.Count);
                }

                // Mark trips as completed
                var pastTrips = await db.Trips
                    .Where(t => t.Status == "scheduled" && t.ArrivalTime < DateTime.UtcNow)
                    .ToListAsync(stoppingToken);

                if (pastTrips.Any())
                {
                    foreach (var t in pastTrips)
                    {
                        t.Status = "completed";
                    }
                    await db.SaveChangesAsync(stoppingToken);
                    _logger.LogInformation("Marked {Count} trips as completed", pastTrips.Count);
                }
            }
            catch (OperationCanceledException)
            {
                // Expected during shutdown
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SeatUnlockJob");
            }
        }

        _logger.LogInformation("SeatUnlockJob stopped");
    }
}
