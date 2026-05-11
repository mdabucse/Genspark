using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusBooking.API.Models;

[Table("boarding_points")]
public class BoardingPoint
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("route_id")]
    public int RouteId { get; set; }

    [MaxLength(100)]
    [Column("point_name")]
    public string PointName { get; set; } = string.Empty;

    [MaxLength(10)]
    [Column("point_type")]
    public string PointType { get; set; } = string.Empty; // 'boarding' or 'dropping'

    [Column("sequence_no")]
    public int SequenceNo { get; set; }

    // Navigation properties
    [ForeignKey("RouteId")]
    public Route Route { get; set; } = null!;
}
