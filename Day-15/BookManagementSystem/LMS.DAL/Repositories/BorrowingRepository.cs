using LMS.Context.DbContextFolder;
using LMS.Interfaces.Repositories;
using LMS.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LMS.DAL.Repositories;

public class BorrowingRepository
    : GenericRepository<Borrowing>,
      IBorrowingRepository
{
    public BorrowingRepository(
        LibraryDbContext context)
        : base(context)
    {

    }

    public Bookcopy? GetAvailableBookCopy(int bookId)
    {
        return _context.Bookcopies
                       .FirstOrDefault(c =>
                            c.Bookid == bookId &&
                            c.Isavailable == true &&
                            c.Isdamaged == false);
    }

    public int GetActiveBorrowCount(int memberId)
    {
        return _context.Borrowings
                       .Count(b =>
                            b.Memberid == memberId &&
                            b.Isreturned == false);
    }

    public bool HasActiveBorrowing(
        int memberId,
        int bookId)
    {
        return _context.Borrowings
                       .Include(b => b.Copy)
                       .Any(b =>
                            b.Memberid == memberId &&
                            b.Isreturned == false &&
                            b.Copy.Bookid == bookId);
    }

    public void UpdateBookCopy(Bookcopy copy)
    {
        _context.Bookcopies.Update(copy);

        _context.SaveChanges();
    }

    public decimal GetPendingFineAmount(int memberId)
    {
        return _context.Borrowings
                       .Where(b =>
                            b.Memberid == memberId &&
                            b.Fineamount > 0)
                       .Sum(b => b.Fineamount ?? 0);
    }

    public Borrowing? GetBorrowingById(
        int borrowingId)
    {
        return _context.Borrowings
                       .Include(b => b.Copy)
                       .FirstOrDefault(b =>
                            b.Borrowingid == borrowingId);
    }

    public void UpdateBorrowing(
        Borrowing borrowing)
    {
        _context.Borrowings.Update(borrowing);

        _context.SaveChanges();
    }
}