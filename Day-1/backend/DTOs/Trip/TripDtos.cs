using System.ComponentModel.DataAnnotations;

namespace BusBooking.API.DTOs.Trip;

public class CreateTripDto
{
    [Required]
    public int BusId { get; set; }

    [Required]
    public int RouteId { get; set; }

    [Required]
    public DateTime DepartureTime { get; set; }

    [Required]
    public DateTime ArrivalTime { get; set; }

    [Required]
    [Range(0.01, 99999.99)]
    public decimal BaseFare { get; set; }

    public decimal TaxPercent { get; set; } = 5.0m;
}

public class TripSearchDto
{
    [Required]
    public string Source { get; set; } = string.Empty;

    [Required]
    public string Destination { get; set; } = string.Empty;

    [Required]
    public DateTime Date { get; set; }
}

public class TripResponseDto
{
    public int TripId { get; set; }
    public string BusName { get; set; } = string.Empty;
    public string BusType { get; set; } = string.Empty;
    public string SeatLayout { get; set; } = string.Empty;
    public string OperatorName { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public decimal BaseFare { get; set; }
    public decimal TaxPercent { get; set; }
    public decimal TotalFare { get; set; }
    public int AvailableSeats { get; set; }
    public int TotalSeats { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class SeatStatusDto
{
    public int SeatId { get; set; }
    public string SeatNumber { get; set; } = string.Empty;
    public string SeatType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // available, booked, locked
}

public class CreateRouteDto
{
    [Required]
    [MaxLength(100)]
    public string Source { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Destination { get; set; } = string.Empty;

    public int? DistanceKm { get; set; }
}

public class RouteResponseDto
{
    public int Id { get; set; }
    public string Source { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public int? DistanceKm { get; set; }
    public int TripCount { get; set; }
}

public class CreateBoardingPointDto
{
    [Required]
    public string PointName { get; set; } = string.Empty;

    [Required]
    public string PointType { get; set; } = string.Empty; // boarding or dropping

    public int SequenceNo { get; set; }
}

public class BoardingPointDto
{
    public int Id { get; set; }
    public string PointName { get; set; } = string.Empty;
    public string PointType { get; set; } = string.Empty;
    public int SequenceNo { get; set; }
}
