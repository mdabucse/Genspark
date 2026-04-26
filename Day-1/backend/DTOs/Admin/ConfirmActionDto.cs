using System.ComponentModel.DataAnnotations;

namespace BusBooking.API.DTOs.Admin;

public class ConfirmActionDto
{
    [Required]
    public string Password { get; set; } = string.Empty;
}
