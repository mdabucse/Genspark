using Task_1.Models;

namespace Task_1.Services;

public interface IBookService
{
    void AddBook(Book book);
    List<Book> GetAllBooks();
    Book? GetBookById(int id);
}
