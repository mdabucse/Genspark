using Microsoft.AspNetCore.Mvc;
using Task_1.Models;
using Task_1.Services;

namespace Task_1.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly IBookService _bookService;

    public BooksController(IBookService bookService)
    {
        _bookService = bookService;
    }

    [HttpPost]
    public IActionResult AddBook([FromBody] Book book)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            _bookService.AddBook(book);
            return Ok(new { message = "Book added successfully" });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet]
    public ActionResult<List<Book>> GetAllBooks()
    {
        return _bookService.GetAllBooks();
    }

    [HttpGet("{id}")]
    public ActionResult<Book> GetBookById(int id)
    {
        var book = _bookService.GetBookById(id);
        if (book == null)
        {
            return NotFound();
        }
        return book;
    }
}
