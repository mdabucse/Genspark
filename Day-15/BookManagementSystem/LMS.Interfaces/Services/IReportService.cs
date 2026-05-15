using LMS.Models.Entities;

namespace LMS.Interfaces.Services;

public interface IReportService
{
    List<Borrowing> GetOverdueBooks();
    List<Member> GetMembersWithPendingFine();
    List<object> GetMostBorrowedBooks();
    List<Book> GetAvailableBooks();
    List<Borrowing> GetMemberBorrowingHistory(int memberId);
}