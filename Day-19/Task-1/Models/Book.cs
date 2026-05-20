using System.ComponentModel.DataAnnotations;

namespace Task_1.Models;

public class Book
{
    public int BookId { get; set; }

    [Required(ErrorMessage = "Book title should not be empty.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Author name should not be empty.")]
    public string Author { get; set; } = string.Empty;

    [Required(ErrorMessage = "ISBN should not be empty.")]
    public string Isbn { get; set; } = string.Empty;

    public int PublishedYear { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Available copies should be greater than or equal to 0.")]
    public int AvailableCopies { get; set; }
}
