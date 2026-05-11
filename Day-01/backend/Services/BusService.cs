using BusBooking.API.Data;
using BusBooking.API.DTOs.Bus;
using BusBooking.API.Interfaces;
using BusBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BusBooking.API.Services;

public class BusService : IBusService
{
    private readonly AppDbContext _db;
    private readonly IEmailService _emailService;

    public BusService(AppDbContext db, IEmailService emailService)
    {
        _db = db;
        _emailService = emailService;
    }

    public async Task<List<BusResponseDto>> GetAllBusesAsync()
    {
        return await _db.Buses
            .Where(b => b.IsActive)
            .Select(b => MapToDto(b))
            .ToListAsync();
    }

    public async Task<BusResponseDto?> GetBusByIdAsync(int id)
    {
        var bus = await _db.Buses.FindAsync(id);
        return bus == null ? null : MapToDto(bus);
    }

    public async Task<BusResponseDto> CreateBusAsync(CreateBusDto dto, int operatorId)
    {
        // Check for duplicate bus number
        if (await _db.Buses.AnyAsync(b => b.BusNumber == dto.BusNumber))
            throw new ArgumentException("Bus number already exists");

        var bus = new Bus
        {
            OperatorId = operatorId,
            BusNumber = dto.BusNumber,
            BusName = dto.BusName,
            Capacity = dto.Capacity,
            BusType = dto.BusType,
            SeatLayout = dto.SeatLayout
        };

        _db.Buses.Add(bus);
        await _db.SaveChangesAsync();

        // Use custom layout if provided, otherwise auto-generate
        var seats = new List<Seat>();
        if (dto.Seats != null && dto.Seats.Any())
        {
            bus.Rows = dto.Rows;
            bus.Columns = dto.Columns;
            bus.HasUpperDeck = dto.HasUpperDeck;
            bus.Capacity = dto.Seats.Count;
            
            seats.AddRange(dto.Seats.Select(s => new Seat
            {
                BusId = bus.Id,
                SeatNumber = s.SeatNumber,
                SeatType = s.SeatType,
                Row = s.Row,
                Column = s.Column,
                Deck = s.Deck
            }));
        }
        else
        {
            for (int i = 1; i <= dto.Capacity; i++)
            {
                seats.Add(new Seat
                {
                    BusId = bus.Id,
                    SeatNumber = GenerateSeatLabel(i, dto.SeatLayout),
                    SeatType = GetSeatType(i, dto.SeatLayout)
                });
            }
        }

        _db.Seats.AddRange(seats);
        await _db.SaveChangesAsync();

        return MapToDto(bus);
    }

    public async Task<BusResponseDto> UpdateBusAsync(int id, UpdateBusDto dto, int operatorId)
    {
        var bus = await _db.Buses.FirstOrDefaultAsync(b => b.Id == id && b.OperatorId == operatorId);
        if (bus == null)
            throw new KeyNotFoundException("Bus not found or you don't have permission");

        if (dto.BusName != null) bus.BusName = dto.BusName;
        if (dto.BusType != null) bus.BusType = dto.BusType;
        if (dto.IsActive.HasValue) bus.IsActive = dto.IsActive.Value;

        await _db.SaveChangesAsync();
        return MapToDto(bus);
    }

    public async Task<bool> DeleteBusAsync(int id, int operatorId)
    {
        var bus = await _db.Buses.FirstOrDefaultAsync(b => b.Id == id && b.OperatorId == operatorId);
        if (bus == null)
            throw new KeyNotFoundException("Bus not found or you don't have permission");

        bus.IsActive = false; // Soft delete
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<BusResponseDto>> GetOperatorBusesAsync(int operatorId)
    {
        return await _db.Buses
            .Where(b => b.OperatorId == operatorId)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => MapToDto(b))
            .ToListAsync();
    }

    public async Task<BusResponseDto> ToggleBusStatusAsync(int id, int operatorId)
    {
        var bus = await _db.Buses
            .Include(b => b.Trips)
            .FirstOrDefaultAsync(b => b.Id == id && b.OperatorId == operatorId);

        if (bus == null)
            throw new KeyNotFoundException("Bus not found or you don't have permission");

        bus.IsActive = !bus.IsActive;
        await _db.SaveChangesAsync();

        if (!bus.IsActive) // Bus was blocked
        {
            // Find all confirmed bookings for future trips using this bus
            var futureTripIds = bus.Trips
                .Where(t => t.DepartureTime > DateTime.UtcNow)
                .Select(t => t.Id)
                .ToList();

            if (futureTripIds.Any())
            {
                var bookingsToNotify = await _db.Bookings
                    .Include(b => b.User)
                    .Include(b => b.Trip).ThenInclude(t => t.Route)
                    .Include(b => b.Trip).ThenInclude(t => t.Bus)
                    .Where(b => futureTripIds.Contains(b.TripId) && b.Status == "confirmed")
                    .ToListAsync();

                foreach (var booking in bookingsToNotify)
                {
                    try
                    {
                        await _emailService.SendBusBlockedNotificationAsync(booking);
                    }
                    catch
                    {
                        // Log error but continue notifying others
                    }
                }
            }
        }

        return MapToDto(bus);
    }

    public async Task<BusResponseDto> UpdateBusLayoutAsync(int id, UpdateBusLayoutDto dto, int operatorId)
    {
        var bus = await _db.Buses
            .Include(b => b.Seats)
            .FirstOrDefaultAsync(b => b.Id == id && b.OperatorId == operatorId);

        if (bus == null)
            throw new KeyNotFoundException("Bus not found or you don't have permission");

        // Update dimensions
        bus.Rows = dto.Rows;
        bus.Columns = dto.Columns;
        bus.HasUpperDeck = dto.HasUpperDeck;

        // Remove old seats (be careful if there are active bookings, 
        // but typically layout changes are only allowed for future trips or new buses)
        // Check if there are future trips with bookings
        var futureTripsWithBookings = await _db.Trips
            .AnyAsync(t => t.BusId == id && t.DepartureTime > DateTime.UtcNow && t.TripSeatStatuses.Any(ss => ss.Status == "booked"));
            
        if (futureTripsWithBookings)
            throw new InvalidOperationException("Cannot change layout of a bus that has future trips with active bookings.");

        _db.Seats.RemoveRange(bus.Seats);
        
        // Add new seats
        var newSeats = dto.Seats.Select(s => new Seat
        {
            BusId = bus.Id,
            SeatNumber = s.SeatNumber,
            SeatType = s.SeatType,
            Row = s.Row,
            Column = s.Column,
            Deck = s.Deck
        }).ToList();

        _db.Seats.AddRange(newSeats);
        bus.Capacity = newSeats.Count;

        await _db.SaveChangesAsync();
        return MapToDto(bus);
    }

    private static string GenerateSeatLabel(int index, string layout)
    {
        // For 2x2: A1, A2, A3, A4 (row A), B1, B2, B3, B4 (row B), etc.
        int seatsPerRow = layout == "2x1" ? 3 : layout == "1x1" ? 2 : 4;
        int row = (index - 1) / seatsPerRow;
        int col = (index - 1) % seatsPerRow + 1;
        char rowLetter = (char)('A' + row);
        return $"{rowLetter}{col}";
    }

    private static string GetSeatType(int index, string layout)
    {
        int seatsPerRow = layout == "2x1" ? 3 : layout == "1x1" ? 2 : 4;
        int col = (index - 1) % seatsPerRow + 1;

        return layout switch
        {
            "2x2" => (col == 1 || col == 4) ? "window" : "aisle",
            "2x1" => col == 1 ? "window" : col == 2 ? "aisle" : "window",
            "1x1" => col == 1 ? "window" : "window",
            _ => "aisle"
        };
    }

    private static BusResponseDto MapToDto(Bus bus)
    {
        return new BusResponseDto
        {
            Id = bus.Id,
            OperatorId = bus.OperatorId,
            BusNumber = bus.BusNumber,
            BusName = bus.BusName,
            Capacity = bus.Capacity,
            BusType = bus.BusType,
            SeatLayout = bus.SeatLayout,
            IsActive = bus.IsActive,
            Rows = bus.Rows,
            Columns = bus.Columns,
            HasUpperDeck = bus.HasUpperDeck,
            Seats = bus.Seats.Select(s => new SeatLayoutDto
            {
                SeatNumber = s.SeatNumber,
                SeatType = s.SeatType,
                Row = s.Row,
                Column = s.Column,
                Deck = s.Deck
            }).ToList(),
            CreatedAt = bus.CreatedAt
        };
    }
}
