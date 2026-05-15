using LMS.Context.DbContextFolder;
using LMS.Interfaces.Repositories;
using LMS.Models.Entities;

namespace LMS.DAL.Repositories;

public class BookRepository : GenericRepository<Book>,IBookRepository
{
    public BookRepository(LibraryDbContext context): base(context)
    {

    }
    // Adding the book copy
    public void AddBookCopy(Bookcopy copy)
    {
        _context.Bookcopies.Add(copy);
        _context.SaveChanges();
    }

    // Searching the book by title or author
    public List<Book> SearchBooks(string keyword)
    {
        return _context.Books
            .Where(b =>
                b.Title.ToLower()
                    .Contains(keyword.ToLower()) ||

                b.Author.ToLower()
                    .Contains(keyword.ToLower()))
            .ToList();
    }

    // Getting the available copy count
    public int GetAvailableCopyCount(int bookId)
    {
        return _context.Bookcopies
            .Count(c =>
                c.Bookid == bookId &&
                c.Isavailable == true &&
                c.Isdamaged == false);
    }
}