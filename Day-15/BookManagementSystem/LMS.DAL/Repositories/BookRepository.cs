using LMS.Context.DbContextFolder;
using LMS.Interfaces.Repositories;
using LMS.Models.Entities;

namespace LMS.DAL.Repositories;

public class BookRepository : IBookRepository
{
    private readonly LibraryDbContext _context;
    public BookRepository(LibraryDbContext context)
    {
        _context = context;
    }
    public void AddBook(Book book)
    {
        _context.Books.Add(book);
        _context.SaveChanges();
    }

    public void AddBookCopy(Bookcopy copy)
    {
        _context.Bookcopies.Add(copy);
        _context.SaveChanges();
    }

    public List<Book> GetAllBooks()
    {
        return _context.Books.ToList();
    }

    public Book? GetBookById(int bookId)
    {
        return _context.Books
                       .FirstOrDefault(b => b.Bookid == bookId);
    }

    public List<Book> SearchBooks(string keyword)
    {
        return _context.Books
                       .Where(b =>
                           b.Title.ToLower().Contains(keyword.ToLower()) ||
                           b.Author.ToLower().Contains(keyword.ToLower()))
                       .ToList();
    }

    public int GetAvailableCopyCount(int bookId)
    {
        return _context.Bookcopies
                       .Count(c =>
                           c.Bookid == bookId &&
                           c.Isavailable == true &&
                           c.Isdamaged == false);
    }
}