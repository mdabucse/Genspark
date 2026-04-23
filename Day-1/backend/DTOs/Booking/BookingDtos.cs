using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BusBooking.API.DTOs.Booking;

public class CreateBookingDto
{
    [Required]
    public int TripId { get; set; }

    [Required]
    public List<PassengerDto> Passengers { get; set; } = new();

    [EmailAddress]
    [MaxLength(200)]
    [JsonPropertyName("contactEmail")]
    public string? ContactEmail { get; set; }
}

public class PassengerDto
{
    [Required]
    public int SeatId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Range(1, 120)]
    public int Age { get; set; }

    [Required]
    public string Gender { get; set; } = string.Empty;
}

public class SeatLockDto
{
    [Required]
    public int TripId { get; set; }

    [Required]
    public int[] SeatIds { get; set; } = Array.Empty<int>();
}

public class BookingResponseDto
{
    public int BookingId { get; set; }
    public string BookingRef { get; set; } = string.Empty;
    public decimal TotalFare { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime BookedAt { get; set; }
    public TripInfoDto? Trip { get; set; }
    public List<PassengerInfoDto> Passengers { get; set; } = new();
}

public class TripInfoDto
{
    public string BusName { get; set; } = string.Empty;
    public string BusType { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
}

public class PassengerInfoDto
{
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string SeatNumber { get; set; } = string.Empty;
}

public class SeatLockResponseDto
{
    public bool Success { get; set; }
    public DateTime LockExpiry { get; set; }
    public string Message { get; set; } = string.Empty;
}
