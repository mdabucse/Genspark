using LMS.Interfaces.Repositories;
using LMS.Interfaces.Services;
using LMS.Models.Entities;

namespace LMS.BL.Services;

public class ReportService : IReportService
{
    private readonly IReportRepository _reportRepository;

    public ReportService(IReportRepository reportRepository)
    {
        _reportRepository = reportRepository;
    }

    public List<Borrowing> GetOverdueBooks()
    {
        return _reportRepository.GetOverdueBooks();
    }

    public List<Member> GetMembersWithPendingFine()
    {
        return _reportRepository
               .GetMembersWithPendingFine();
    }

    public List<object> GetMostBorrowedBooks()
    {
        return _reportRepository
               .GetMostBorrowedBooks();
    }

    public List<Book> GetAvailableBooks()
    {
        return _reportRepository
               .GetAvailableBooks();
    }

    public List<Borrowing> GetMemberBorrowingHistory(
        int memberId)
    {
        return _reportRepository
               .GetMemberBorrowingHistory(memberId);
    }
}