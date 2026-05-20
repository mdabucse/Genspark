using Task_1.Context;
using Task_1.Models;

namespace Task_1.Repository;

public class BookRepository : GenericRepository<Book>, IBookRepository
{
    public BookRepository(LibraryDbContext context)
        : base(context)
    {
    }
}
