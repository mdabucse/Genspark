using LMS.Models.Entities;

namespace LMS.Interfaces.Repositories;

public interface IBookRepository: IGenericRepository<Book>
{
    void AddBookCopy(Bookcopy copy);

    List<Book> SearchBooks(string keyword);

    int GetAvailableCopyCount(int bookId);
}