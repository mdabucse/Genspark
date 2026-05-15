using LMS.Interfaces.Repositories;
using LMS.Interfaces.Services;
using LMS.Models.Entities;
using LMS.Exceptions.BookExceptions;

namespace LMS.BL.Services;

public class BookService : IBookService
{
    private readonly IBookRepository _bookRepository;

    public BookService(IBookRepository bookRepository)
    {
        _bookRepository = bookRepository;
    }

    public void AddBook(Book book)
    {
        _bookRepository.Add(book);
    }

    public void AddBookCopies(int bookId, int numberOfCopies)
    {
        Book? book =
            _bookRepository.GetById(bookId);

        if (book == null)
        {
            throw new BookNotFoundException();
        }

        for (int i = 0; i < numberOfCopies; i++)
        {
            Bookcopy copy = new Bookcopy
            {
                Bookid = bookId,
                Isavailable = true,
                Isdamaged = false
            };

            _bookRepository.Add(book);
        }
    }

    public List<Book> GetAllBooks()
    {
        return _bookRepository.GetAll();
    }

    public List<Book> SearchBooks(string keyword)
    {
        return _bookRepository.SearchBooks(keyword);
    }
}