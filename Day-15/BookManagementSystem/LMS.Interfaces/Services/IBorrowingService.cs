namespace LMS.Interfaces.Services;

public interface IBorrowingService
{
    void BorrowBook(int memberId, int bookId);
}