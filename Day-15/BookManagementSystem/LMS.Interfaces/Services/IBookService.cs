using LMS.Models.Entities;

namespace LMS.Interfaces.Services;

public interface IBookService
{
    void AddBook(Book book);
    void AddBookCopies(int bookId, int numberOfCopies);
    List<Book> GetAllBooks();
    List<Book> SearchBooks(string keyword);
}