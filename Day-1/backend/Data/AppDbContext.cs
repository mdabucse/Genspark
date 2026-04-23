using Microsoft.EntityFrameworkCore;
using BusBooking.API.Models;

namespace BusBooking.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Bus> Buses => Set<Bus>();
    public DbSet<Models.Route> Routes => Set<Models.Route>();
    public DbSet<BoardingPoint> BoardingPoints => Set<BoardingPoint>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<Seat> Seats => Set<Seat>();
    public DbSet<TripSeatStatus> TripSeatStatuses => Set<TripSeatStatus>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<BookingPassenger> BookingPassengers => Set<BookingPassenger>();
    public DbSet<Payment> Payments => Set<Payment>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        base.OnModelCreating(mb);

        // Unique constraint on email
        mb.Entity<User>().HasIndex(u => u.Email).IsUnique();

        // Unique constraint on bus number
        mb.Entity<Bus>().HasIndex(b => b.BusNumber).IsUnique();

        // Unique constraint on booking reference
        mb.Entity<Booking>().HasIndex(b => b.BookingRef).IsUnique();

        // Composite unique index on TripSeatStatus (trip_id + seat_id)
        mb.Entity<TripSeatStatus>()
            .HasIndex(t => new { t.TripId, t.SeatId })
            .IsUnique();

        // One booking has one payment
        mb.Entity<Payment>()
            .HasOne(p => p.Booking)
            .WithOne(b => b.Payment)
            .HasForeignKey<Payment>(p => p.BookingId);

        // Decimal precision for money columns
        mb.Entity<Trip>().Property(t => t.BaseFare).HasPrecision(10, 2);
        mb.Entity<Trip>().Property(t => t.TaxPercent).HasPrecision(5, 2);
        mb.Entity<Booking>().Property(b => b.TotalAmount).HasPrecision(10, 2);
        mb.Entity<Payment>().Property(p => p.Amount).HasPrecision(10, 2);
    }
}
