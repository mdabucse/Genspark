using LMS.Context.DbContextFolder;
using LMS.Interfaces.Repositories;
using LMS.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LMS.DAL.Repositories;

public class ReportRepository : IReportRepository
{
    private readonly LibraryDbContext _context;
    // Constructor to initialize the context
    public ReportRepository(LibraryDbContext context)
    {
        _context = context;
    }
    // Implement the GetOverdueBooks method to retrieve a list of overdue borrowings
    public List<Borrowing> GetOverdueBooks()
    {
        return _context.Borrowings
                .Include(b => b.Member)
                .Include(b => b.Copy)
                .ThenInclude(c => c.Book)
                .Where(b =>
                    b.Isreturned == false &&
                    b.Duedate < DateTime.Now)
                .ToList();
    }

    // Implement the GetMembersWithPendingFine method to retrieve a list of members with pending fines
    public List<Member> GetMembersWithPendingFine()
    {
        return _context.Members
                    .Where(m =>
                        m.Borrowings
                            .Any(b => b.Fineamount > 0))
                    .ToList();
    }

    // Implement the GetMostBorrowedBooks method to retrieve a list of the most borrowed books
    public List<object> GetMostBorrowedBooks()
    {
        return _context.Borrowings
                .Include(b => b.Copy)
                .ThenInclude(c => c.Book)
                .GroupBy(b => b.Copy.Book.Title)
                .Select(g => new
                {
                    BookTitle = g.Key,
                    BorrowCount = g.Count()
                })
                .OrderByDescending(x => x.BorrowCount)
                .Cast<object>()
                .ToList();
    }

    // Implement the GetAvailableBooks method to retrieve a list of books that have available copies
    public List<Book> GetAvailableBooks()
    {
        return _context.Books
                    .Where(b =>
                        b.Bookcopies
                            .Any(c =>
                                c.Isavailable == true &&
                                c.Isdamaged == false))
                    .ToList();
    }

    // Implement the GetMemberBorrowingHistory method to retrieve a list of borrowings for a specific member
    public List<Borrowing> GetMemberBorrowingHistory(
        int memberId)
    {
        return _context.Borrowings
                    .Include(b => b.Copy)
                    .ThenInclude(c => c.Book)
                    .Where(b => b.Memberid == memberId)
                    .ToList();
}
}