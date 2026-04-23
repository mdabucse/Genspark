using BusBooking.API.DTOs.Trip;

namespace BusBooking.API.Interfaces;

public interface IRouteService
{
    Task<List<RouteResponseDto>> GetAllRoutesAsync();
    Task<List<string>> GetSourcesAsync(string? query);
    Task<List<string>> GetDestinationsAsync(string? source, string? query);
    Task<RouteResponseDto> CreateRouteAsync(CreateRouteDto dto);
    Task<RouteResponseDto> UpdateRouteAsync(int id, CreateRouteDto dto);
    Task<bool> DeleteRouteAsync(int id);
    Task AddBoardingPointAsync(int routeId, CreateBoardingPointDto dto);
    Task<List<BoardingPointDto>> GetBoardingPointsAsync(int routeId);
}
