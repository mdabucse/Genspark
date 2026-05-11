using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusBooking.API.Models;

[Table("buses")]
public class Bus
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("operator_id")]
    public int OperatorId { get; set; }

    [Required]
    [MaxLength(20)]
    [Column("bus_number")]
    public string BusNumber { get; set; } = string.Empty;

    [MaxLength(100)]
    [Column("bus_name")]
    public string BusName { get; set; } = string.Empty;

    [Required]
    [Column("capacity")]
    public int Capacity { get; set; }

    [MaxLength(30)]
    [Column("bus_type")]
    public string BusType { get; set; } = string.Empty;

    [MaxLength(10)]
    [Column("seat_layout")]
    public string SeatLayout { get; set; } = "2x2";

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("rows")]
    public int Rows { get; set; } = 5;

    [Column("cols")]
    public int Columns { get; set; } = 4;

    [Column("has_upper_deck")]
    public bool HasUpperDeck { get; set; } = false;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("OperatorId")]
    public User Operator { get; set; } = null!;
    public ICollection<Seat> Seats { get; set; } = new List<Seat>();
    public ICollection<Trip> Trips { get; set; } = new List<Trip>();
}
