using LMS.Context.DbContextFolder;
using LMS.Interfaces.Repositories;
using LMS.Interfaces.Services;
using LMS.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LMS.BL.Services;

public class BorrowingService : IBorrowingService
{
    private readonly IBorrowingRepository _borrowingRepository;

    private readonly IMemberRepository _memberRepository;

    private readonly IBookRepository _bookRepository;

    private readonly LibraryDbContext _context;

    public BorrowingService(
        IBorrowingRepository borrowingRepository,
        IMemberRepository memberRepository,
        IBookRepository bookRepository,
        LibraryDbContext context)
    {
        _borrowingRepository = borrowingRepository;

        _memberRepository = memberRepository;

        _bookRepository = bookRepository;

        _context = context;
    }

    public void BorrowBook(int memberId, int bookId)
    {
        using var transaction =
            _context.Database.BeginTransaction();

        try
        {
            Member? member =
                _memberRepository.GetMemberById(memberId);

            if (member == null)
            {
                throw new Exception("Member not found");
            }

            if (member.Isactive == false)
            {
                throw new Exception("Membership inactive");
            }

            decimal pendingFine =
                _borrowingRepository.GetPendingFineAmount(memberId);

            if (pendingFine > 500)
            {
                throw new Exception("Pending fine exceeds limit");
            }

            int activeBorrowCount =
                _borrowingRepository.GetActiveBorrowCount(memberId);

            int maxLimit =
                member.Membershiptype.Maxborrowlimit;

            if (activeBorrowCount >= maxLimit)
            {
                throw new Exception("Borrow limit exceeded");
            }

            bool alreadyBorrowed =
                _borrowingRepository.HasActiveBorrowing(
                    memberId,
                    bookId);

            if (alreadyBorrowed)
            {
                throw new Exception(
                    "Member already borrowed this book");
            }

            Bookcopy? copy =
                _borrowingRepository.GetAvailableBookCopy(bookId);

            if (copy == null)
            {
                throw new Exception("No available copies");
            }

            int maxDays =
                member.Membershiptype.Maxborrowdays;

            Borrowing borrowing = new Borrowing
            {
                Memberid = memberId,
                Copyid = copy.Copyid,
                Borrowdate = DateTime.Now,
                Duedate = DateTime.Now.AddDays(maxDays),
                Isreturned = false,
                Fineamount = 0
            };

            _borrowingRepository.AddBorrowing(borrowing);

            copy.Isavailable = false;

            _borrowingRepository.UpdateBookCopy(copy);

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