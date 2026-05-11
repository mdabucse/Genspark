using System.ComponentModel.DataAnnotations;

namespace BusBooking.API.Models;

public class AuditLog
{
    public int Id { get; set; }

    [Required]
    public string Action { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string TargetType { get; set; } = string.Empty;

    public string? TargetId { get; set; }

    [Required]
    public string AdminEmail { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
