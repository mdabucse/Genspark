using LMS.Models.Entities;

namespace LMS.Interfaces.Services;

public interface IBorrowingService
{
    void BorrowBook(int memberId, int bookId);
    List<Borrowing> GetActiveBorrowings(int memberId);
}