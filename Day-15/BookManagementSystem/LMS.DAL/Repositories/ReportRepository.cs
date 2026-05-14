using LMS.Context.DbContextFolder;
using LMS.Interfaces.Repositories;
using LMS.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LMS.DAL.Repositories;

public class ReportRepository : IReportRepository
{
    private readonly LibraryDbContext _context;

    public ReportRepository(LibraryDbContext context)
    {
        _context = context;
    }

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

    public List<Member> GetMembersWithPendingFine()
    {
        return _context.Members
                       .Where(m =>
                            m.Borrowings
                             .Any(b => b.Fineamount > 0))
                       .ToList();
    }

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