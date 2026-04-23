using BusBooking.API.DTOs.Bus;

namespace BusBooking.API.Interfaces;

public interface IBusService
{
    Task<List<BusResponseDto>> GetAllBusesAsync();
    Task<BusResponseDto?> GetBusByIdAsync(int id);
    Task<BusResponseDto> CreateBusAsync(CreateBusDto dto, int operatorId);
    Task<BusResponseDto> UpdateBusAsync(int id, UpdateBusDto dto, int operatorId);
    Task<bool> DeleteBusAsync(int id, int operatorId);
    Task<List<BusResponseDto>> GetOperatorBusesAsync(int operatorId);
}
