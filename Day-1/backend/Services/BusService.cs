using BusBooking.API.Data;
using BusBooking.API.DTOs.Bus;
using BusBooking.API.Interfaces;
using BusBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BusBooking.API.Services;

public class BusService : IBusService
{
    private readonly AppDbContext _db;

    public BusService(AppDbContext db)
    {
        _db = db;
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

        // Auto-generate seats based on capacity and layout
        var seats = new List<Seat>();
        for (int i = 1; i <= dto.Capacity; i++)
        {
            seats.Add(new Seat
            {
                BusId = bus.Id,
                SeatNumber = GenerateSeatLabel(i, dto.SeatLayout),
                SeatType = GetSeatType(i, dto.SeatLayout)
            });
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
            .Select(b => MapToDto(b))
            .ToListAsync();
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
            CreatedAt = bus.CreatedAt
        };
    }
}
