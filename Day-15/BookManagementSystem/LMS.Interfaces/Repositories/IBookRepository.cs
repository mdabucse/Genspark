using LMS.Models.Entities;

namespace LMS.Interfaces.Repositories;

public interface IBookRepository
{
    void AddBook(Book book);
    void AddBookCopy(Bookcopy copy);
    List<Book> GetAllBooks();
    Book? GetBookById(int bookId);
    List<Book> SearchBooks(string keyword);
    int GetAvailableCopyCount(int bookId);
}