using LMS.Context.DbContextFolder;
using LMS.Interfaces.Repositories;
using LMS.Interfaces.Services;
using LMS.Models.Entities;
using LMS.Exceptions.BorrowingExceptions;

namespace LMS.BL.Services;

public class ReturnService : IReturnService
{
    private readonly IBorrowingRepository _borrowingRepository;

    private readonly LibraryDbContext _context;

    public ReturnService(
        IBorrowingRepository borrowingRepository,
        LibraryDbContext context)
    {
        _borrowingRepository = borrowingRepository;

        _context = context;
    }

    public void ReturnBook(int borrowingId)
    {
        using var transaction =
            _context.Database.BeginTransaction();

        try
        {
            Borrowing? borrowing =
                _borrowingRepository
                .GetBorrowingById(borrowingId);

            if (borrowing == null)
            {
                throw new BorrowingNotFoundException();
            }

            if (borrowing.Isreturned == true)
            {
                throw new AlreadyReturnedException();
            }

            DateTime dueDate =
                    borrowing.Duedate;

            DateTime returnDate =
                DateTime.Now;

            int delayedDays =
                (returnDate - dueDate).Days;

            decimal fine = 0;

            if (delayedDays > 0)
            {
                fine = delayedDays * 10;
            }

            borrowing.Returndate = returnDate;

            borrowing.Isreturned = true;

            borrowing.Fineamount = fine;

            _borrowingRepository.UpdateBorrowing(
                borrowing);

            borrowing.Copy.Isavailable = true;

            _borrowingRepository.UpdateBookCopy(
                borrowing.Copy);

            _context.SaveChanges();

            transaction.Commit();
        }
        catch
        {
            transaction.Rollback();

            throw;
        }
    }
}