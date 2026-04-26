using BusBooking.API.Data;
using BusBooking.API.DTOs.Trip;
using BusBooking.API.Interfaces;
using BusBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BusBooking.API.Services;

public class RouteService : IRouteService
{
    private readonly AppDbContext _db;

    public RouteService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<RouteResponseDto>> GetAllRoutesAsync()
    {
        return await _db.Routes
            .Select(r => new RouteResponseDto
            {
                Id = r.Id,
                Source = r.Source,
                Destination = r.Destination,
                DistanceKm = r.DistanceKm,
                TripCount = r.Trips.Count
            })
            .ToListAsync();
    }

    public async Task<List<string>> GetSourcesAsync(string? query)
    {
        var sources = _db.Routes.Select(r => r.Source);

        if (!string.IsNullOrWhiteSpace(query))
        {
            var search = query.Trim().ToLower();
            sources = sources.Where(source => source.ToLower().Contains(search));
        }

        return await sources
            .Distinct()
            .OrderBy(source => source)
            .Take(20)
            .ToListAsync();
    }

    public async Task<List<string>> GetDestinationsAsync(string? source, string? query)
    {
        var routes = _db.Routes.AsQueryable();

        if (!string.IsNullOrWhiteSpace(source))
        {
            var selectedSource = source.Trim().ToLower();
            routes = routes.Where(route => route.Source.ToLower() == selectedSource);
        }

        var destinations = routes.Select(route => route.Destination);

        if (!string.IsNullOrWhiteSpace(query))
        {
            var search = query.Trim().ToLower();
            destinations = destinations.Where(destination => destination.ToLower().Contains(search));
        }

        return await destinations
            .Distinct()
            .OrderBy(destination => destination)
            .Take(20)
            .ToListAsync();
    }

    public async Task<RouteResponseDto> CreateRouteAsync(CreateRouteDto dto)
    {
        var source = dto.Source.Trim();
        var destination = dto.Destination.Trim();

        // 1. Check if the forward route already exists
        var existingRoute = await _db.Routes.FirstOrDefaultAsync(r => 
            r.Source.ToLower() == source.ToLower() && 
            r.Destination.ToLower() == destination.ToLower());

        if (existingRoute == null)
        {
            existingRoute = new Models.Route
            {
                Source = source,
                Destination = destination,
                DistanceKm = dto.DistanceKm
            };
            _db.Routes.Add(existingRoute);
        }

        // 2. Check if the reverse route already exists
        var existingReverse = await _db.Routes.AnyAsync(r => 
            r.Source.ToLower() == destination.ToLower() && 
            r.Destination.ToLower() == source.ToLower());

        if (!existingReverse)
        {
            var reverseRoute = new Models.Route
            {
                Source = destination,
                Destination = source,
                DistanceKm = dto.DistanceKm
            };
            _db.Routes.Add(reverseRoute);
        }

        await _db.SaveChangesAsync();

        return new RouteResponseDto
        {
            Id = existingRoute.Id,
            Source = existingRoute.Source,
            Destination = existingRoute.Destination,
            DistanceKm = existingRoute.DistanceKm,
            TripCount = 0
        };
    }

    public async Task<RouteResponseDto> UpdateRouteAsync(int id, CreateRouteDto dto)
    {
        var route = await _db.Routes.FindAsync(id);
        if (route == null) throw new KeyNotFoundException("Route not found");

        route.Source = dto.Source;
        route.Destination = dto.Destination;
        route.DistanceKm = dto.DistanceKm;

        await _db.SaveChangesAsync();

        return new RouteResponseDto
        {
            Id = route.Id,
            Source = route.Source,
            Destination = route.Destination,
            DistanceKm = route.DistanceKm,
            TripCount = await _db.Trips.CountAsync(t => t.RouteId == id)
        };
    }

    public async Task<bool> DeleteRouteAsync(int id)
    {
        var route = await _db.Routes.FindAsync(id);
        if (route == null) throw new KeyNotFoundException("Route not found");

        _db.Routes.Remove(route);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task AddBoardingPointAsync(int routeId, CreateBoardingPointDto dto)
    {
        var route = await _db.Routes.FindAsync(routeId);
        if (route == null) throw new KeyNotFoundException("Route not found");

        var point = new BoardingPoint
        {
            RouteId = routeId,
            PointName = dto.PointName,
            PointType = dto.PointType,
            SequenceNo = dto.SequenceNo
        };

        _db.BoardingPoints.Add(point);
        await _db.SaveChangesAsync();
    }

    public async Task<List<BoardingPointDto>> GetBoardingPointsAsync(int routeId)
    {
        var route = await _db.Routes.FindAsync(routeId);
        if (route == null) throw new KeyNotFoundException("Route not found");

        return await _db.BoardingPoints
            .Where(bp => bp.RouteId == routeId)
            .OrderBy(bp => bp.SequenceNo)
            .Select(bp => new BoardingPointDto
            {
                Id = bp.Id,
                PointName = bp.PointName,
                PointType = bp.PointType,
                SequenceNo = bp.SequenceNo
            })
            .ToListAsync();
    }
}
