using LMS.Models.Entities;

namespace LMS.Interfaces.Repositories;

public interface IReportRepository
{
    List<Borrowing> GetOverdueBooks();
    List<Member> GetMembersWithPendingFine();
    List<object> GetMostBorrowedBooks();
    List<Book> GetAvailableBooks();
    List<Borrowing> GetMemberBorrowingHistory(int memberId);
}