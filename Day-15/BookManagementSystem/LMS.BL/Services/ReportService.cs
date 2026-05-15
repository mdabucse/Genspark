using LMS.Interfaces.Repositories;
using LMS.Interfaces.Services;
using LMS.Models.Entities;

namespace LMS.BL.Services;

public class ReportService : IReportService
{
    private readonly IReportRepository _reportRepository;

    // Injecting dependencies
    public ReportService(IReportRepository reportRepository)
    {
        _reportRepository = reportRepository;
    }

    // Getting overdue books
    public List<Borrowing> GetOverdueBooks()
    {
        return _reportRepository.GetOverdueBooks();
    }
    
    // Getting members with pending fine
    public List<Member> GetMembersWithPendingFine()
    {
        return _reportRepository.GetMembersWithPendingFine();
    }

    // Getting most borrowed books
    public List<object> GetMostBorrowedBooks()
    {
        return _reportRepository.GetMostBorrowedBooks();
    }

    // Getting available books
    public List<Book> GetAvailableBooks()
    {
        return _reportRepository.GetAvailableBooks();
    }
    
    // Borrow history
    public List<Borrowing> GetMemberBorrowingHistory(int memberId)
    {
        return _reportRepository.GetMemberBorrowingHistory(memberId);
    }
}