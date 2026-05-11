using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusBooking.API.Models;

[Table("routes")]
public class Route
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("source")]
    public string Source { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [Column("destination")]
    public string Destination { get; set; } = string.Empty;

    [Column("distance_km")]
    public int? DistanceKm { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<BoardingPoint> BoardingPoints { get; set; } = new List<BoardingPoint>();
    public ICollection<Trip> Trips { get; set; } = new List<Trip>();
}
