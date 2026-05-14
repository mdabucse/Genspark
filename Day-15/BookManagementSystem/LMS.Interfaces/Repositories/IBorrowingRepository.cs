using LMS.Models.Entities;

namespace LMS.Interfaces.Repositories;

public interface IBorrowingRepository
{
    Bookcopy? GetAvailableBookCopy(int bookId);

    int GetActiveBorrowCount(int memberId);

    bool HasActiveBorrowing(int memberId, int bookId);

    void AddBorrowing(Borrowing borrowing);

    void UpdateBookCopy(Bookcopy copy);

    decimal GetPendingFineAmount(int memberId);

    Borrowing? GetBorrowingById(int borrowingId);

    void UpdateBorrowing(Borrowing borrowing);
}