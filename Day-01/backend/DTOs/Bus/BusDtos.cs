using System.ComponentModel.DataAnnotations;

namespace BusBooking.API.DTOs.Bus;

public class CreateBusDto
{
    [Required]
    [MaxLength(20)]
    public string BusNumber { get; set; } = string.Empty;

    [MaxLength(100)]
    public string BusName { get; set; } = string.Empty;

    [Required]
    [Range(1, 100)]
    public int Capacity { get; set; }

    [Required]
    public string BusType { get; set; } = string.Empty; // AC, Non-AC, Sleeper, Semi-Sleeper

    public string SeatLayout { get; set; } = "2x2";
    public int Rows { get; set; }
    public int Columns { get; set; }
    public bool HasUpperDeck { get; set; }
    public List<SeatLayoutDto> Seats { get; set; } = new();
}

public class UpdateBusDto
{
    [MaxLength(100)]
    public string? BusName { get; set; }
    public string? BusType { get; set; }
    public bool? IsActive { get; set; }
}

public class BusResponseDto
{
    public int Id { get; set; }
    public int OperatorId { get; set; }
    public string BusNumber { get; set; } = string.Empty;
    public string BusName { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string BusType { get; set; } = string.Empty;
    public string SeatLayout { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int Rows { get; set; }
    public int Columns { get; set; }
    public bool HasUpperDeck { get; set; }
    public List<SeatLayoutDto> Seats { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class UpdateBusLayoutDto
{
    public int Rows { get; set; }
    public int Columns { get; set; }
    public bool HasUpperDeck { get; set; }
    public List<SeatLayoutDto> Seats { get; set; } = new();
}

public class SeatLayoutDto
{
    public string SeatNumber { get; set; } = string.Empty;
    public string SeatType { get; set; } = "seater"; // seater, sleeper
    public int Row { get; set; }
    public int Column { get; set; }
    public string Deck { get; set; } = "lower"; // lower, upper
}
