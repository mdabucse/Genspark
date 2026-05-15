using LMS.Context.DbContextFolder;
using LMS.Interfaces.Repositories;
using LMS.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LMS.DAL.Repositories;

public class BorrowingRepository : GenericRepository<Borrowing>,IBorrowingRepository
{
    public BorrowingRepository(LibraryDbContext context): base(context)
    {

    }

    // Getting the available book copy
    public Bookcopy? GetAvailableBookCopy(int bookId)
    {
        return _context.Bookcopies
            .FirstOrDefault(c =>
                c.Bookid == bookId &&
                c.Isavailable == true &&
                c.Isdamaged == false);
    }

    // get the Active Borrow Counts
    public int GetActiveBorrowCount(int memberId)
    {
        return _context.Borrowings
                .Count(b =>
                    b.Memberid == memberId &&
                    b.Isreturned == false);
    }

    // Check if the member has any active borrowing
    public bool HasActiveBorrowing(int memberId,int bookId)
    {
        return _context.Borrowings
                    .Include(b => b.Copy)
                    .Any(b =>
                        b.Memberid == memberId &&
                        b.Isreturned == false &&
                        b.Copy.Bookid == bookId);
    }

    // Update book copy
    public void UpdateBookCopy(Bookcopy copy)
    {
        _context.Bookcopies.Update(copy);
        _context.SaveChanges();
    }

    // Get the pending fine amount
    public decimal GetPendingFineAmount(int memberId)
    {
        DateTime now = DateTime.Now;

        return _context.Borrowings
                    .Where(b =>
                        b.Memberid == memberId &&
                        b.Isreturned == false &&
                        b.Duedate < now)
                    .Sum(b => (decimal)(now - b.Duedate).TotalDays * 10);
    }

    // Get the borrowing by id
    public Borrowing? GetBorrowingById(int borrowingId)
    {
        return _context.Borrowings
                       .Include(b => b.Copy)
                           .ThenInclude(c => c.Book)
                       .FirstOrDefault(b =>
                            b.Borrowingid == borrowingId);
    }

    public void UpdateBorrowing(Borrowing borrowing)
    {
        _context.Borrowings.Update(borrowing);
        _context.SaveChanges();
    }
    
    // Get all active borrowings for a member
    public List<Borrowing> GetActiveBorrowings(int memberId)
    {
        return _context.Borrowings
                    .Include(b => b.Copy)
                        .ThenInclude(c => c.Book)
                    .Where(b =>
                        b.Memberid == memberId &&
                        b.Isreturned == false)
                    .ToList();
    }
}