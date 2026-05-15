using LMS.Interfaces.Services;

namespace LMS.FE.Helpers;

public static class ReportHelper
{
    public static void ShowOverdueBooks(
        IReportService reportService)
    {
        var borrowings =
            reportService.GetOverdueBooks();

        foreach (var borrowing in borrowings)
        {
            Console.WriteLine(
                $"{borrowing.Borrowingid} | " +
                $"{borrowing.Member.Name} | " +
                $"{borrowing.Copy.Book.Title} | " +
                $"{borrowing.Duedate}"
            );
        }
    }

    public static void ShowMembersWithPendingFine(
        IReportService reportService)
    {
        var members =
            reportService.GetMembersWithPendingFine();

        foreach (var member in members)
        {
            Console.WriteLine(
                $"{member.Memberid} | " +
                $"{member.Name}"
            );
        }
    }

    public static void ShowMostBorrowedBooks(
        IReportService reportService)
    {
        var books =
            reportService.GetMostBorrowedBooks();

        foreach (var item in books)
        {
            Console.WriteLine(item);
        }
    }

    public static void ShowAvailableBooks(
        IReportService reportService)
    {
        var books =
            reportService.GetAvailableBooks();

        foreach (var book in books)
        {
            Console.WriteLine(
                $"{book.Bookid} | " +
                $"{book.Title}"
            );
        }
    }

    public static void ShowMemberBorrowingHistory(
        IReportService reportService)
    {
        int memberId =
            InputHelper.ReadInt(
                "Enter Member Id: ");

        var borrowings =
            reportService
            .GetMemberBorrowingHistory(memberId);

        foreach (var borrowing in borrowings)
        {
            Console.WriteLine(
                $"{borrowing.Borrowingid} | " +
                $"{borrowing.Copy.Book.Title} | " +
                $"{borrowing.Borrowdate} | " +
                $"{borrowing.Isreturned}"
            );
        }
    }
}