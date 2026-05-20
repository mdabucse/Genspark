using Task_1.Models;
using Task_1.Repository;

namespace Task_1.Services;

public class BookService : IBookService
{
    private readonly IBookRepository _bookRepository;

    public BookService(IBookRepository bookRepository)
    {
        _bookRepository = bookRepository;
    }

    public void AddBook(Book book)
    {
        ValidateBook(book);
        _bookRepository.Add(book);
    }

    public List<Book> GetAllBooks()
    {
        return _bookRepository.GetAll();
    }

    public Book? GetBookById(int id)
    {
        return _bookRepository.GetById(id);
    }

    private static void ValidateBook(Book book)
    {
        if (string.IsNullOrWhiteSpace(book.Title))
        {
            throw new ArgumentException("Book title should not be empty.");
        }

        if (string.IsNullOrWhiteSpace(book.Author))
        {
            throw new ArgumentException("Author name should not be empty.");
        }

        if (book.AvailableCopies < 0)
        {
            throw new ArgumentException("Available copies should be greater than or equal to 0.");
        }
    }
}
