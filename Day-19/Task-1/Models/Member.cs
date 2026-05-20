using System.ComponentModel.DataAnnotations;

namespace Task_1.Models;

public class Member
{
    public int MemberId { get; set; }

    [Required(ErrorMessage = "Member full name should not be empty.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email should not be empty.")]
    [EmailAddress(ErrorMessage = "Email must be a valid email address.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone number should not be empty.")]
    public string PhoneNumber { get; set; } = string.Empty;

    public DateTime MembershipDate { get; set; }
}
