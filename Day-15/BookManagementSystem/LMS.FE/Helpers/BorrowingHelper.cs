using LMS.Interfaces.Services;

namespace LMS.FE.Helpers;

public static class BorrowingHelper
{
    public static void BorrowBook(
        IBorrowingService borrowingService)
    {
        try
        {
            int memberId =
                InputHelper.ReadInt(
                    "Enter Member Id: ");

            int bookId =
                InputHelper.ReadInt(
                    "Enter Book Id: ");

            borrowingService.BorrowBook(
                memberId,
                bookId);

            Console.WriteLine(
                "Book Borrowed Successfully");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }

    public static void ReturnBook(
        IReturnService returnService)
    {
        try
        {
            int borrowingId =
                InputHelper.ReadInt(
                    "Enter Borrowing Id: ");

            returnService.ReturnBook(
                borrowingId);

            Console.WriteLine(
                "Book Returned Successfully");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }

    public static void ViewMemberFine(
        IFineService fineService)
    {
        try
        {
            int memberId =
                InputHelper.ReadInt(
                    "Enter Member Id: ");

            decimal fine =
                fineService.GetMemberFine(memberId);

            Console.WriteLine(
                $"Total Pending Fine: ₹{fine}");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }
}