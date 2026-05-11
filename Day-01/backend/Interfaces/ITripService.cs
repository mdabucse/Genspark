using BusBooking.API.DTOs.Trip;

namespace BusBooking.API.Interfaces;

public interface ITripService
{
    Task<List<TripResponseDto>> SearchTripsAsync(string source, string destination, DateTime date);
    Task<TripResponseDto?> GetTripByIdAsync(int tripId);
    Task<List<SeatStatusDto>> GetTripSeatsAsync(int tripId);
    Task<TripResponseDto> CreateTripAsync(CreateTripDto dto, int operatorId);
    Task<bool> CancelTripAsync(int tripId, int operatorId);
}

