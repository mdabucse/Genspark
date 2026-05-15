using LMS.Context.DbContextFolder;
using LMS.Interfaces.Repositories;
using LMS.Interfaces.Services;
using LMS.Models.Entities;
using LMS.Exceptions.BorrowingExceptions;
using LMS.Exceptions.MemberExceptions;
using LMS.Exceptions.BookExceptions;
using LMS.Exceptions.FineExceptions;

namespace LMS.BL.Services;

public class BorrowingService : IBorrowingService
{
    private readonly IBorrowingRepository _borrowingRepository;
    private readonly IMemberRepository _memberRepository;
    private readonly IBookRepository _bookRepository;
    private readonly LibraryDbContext _context;

    //Injecting dependencies
    public BorrowingService(IBorrowingRepository borrowingRepository,IMemberRepository memberRepository,IBookRepository bookRepository,LibraryDbContext context)
    {
        _borrowingRepository = borrowingRepository;
        _memberRepository = memberRepository;
        _bookRepository = bookRepository;
        _context = context;
    }

    // Borrowing a book
    public void BorrowBook(int memberId, int bookId)
    {
        using var transaction =
            _context.Database.BeginTransaction();

        try
        {
            Member? member = _memberRepository.GetById(memberId);

            if (member == null)
            {
                throw new MemberNotFoundException();
            }

            if (member.Isactive == false)
            {
                throw new InactiveMembershipException();
            }

            decimal pendingFine =_borrowingRepository.GetPendingFineAmount(memberId);

            if (pendingFine > 500)
            {
                throw new FineLimitExceededException();
            }

            int activeBorrowCount = _borrowingRepository.GetActiveBorrowCount(memberId);
            int maxLimit = member.Membershiptype.Maxborrowlimit;

            if (activeBorrowCount >= maxLimit)
            {
                throw new BorrowLimitExceededException();
            }

            bool alreadyBorrowed =_borrowingRepository.HasActiveBorrowing(memberId,bookId);

            if (alreadyBorrowed)
            {
                throw new AlreadyBorrowedException();
            }

            Bookcopy? copy =_borrowingRepository.GetAvailableBookCopy(bookId);

            if (copy == null)
            {
                throw new BookUnavailableException();
            }

            int maxDays = member.Membershiptype.Maxborrowdays;

            Borrowing borrowing = new Borrowing
            {
                Memberid = memberId,
                Copyid = copy.Copyid,
                Borrowdate = DateTime.Now,
                Duedate = DateTime.Now.AddDays(maxDays),
                Isreturned = false,
                Fineamount = 0
            };

            _borrowingRepository.Add(borrowing);
            copy.Isavailable = false;
            _borrowingRepository.UpdateBookCopy(copy);
            transaction.Commit();
        }
        catch
        {
            transaction.Rollback();

            throw;
        }
    }

    // Getting active borrowings
    public List<Borrowing> GetActiveBorrowings(int memberId)
    {
        return _borrowingRepository.GetActiveBorrowings(memberId);
    }
}