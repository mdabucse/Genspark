using LMS.Interfaces.Services;
using LMS.Models.Entities;

namespace LMS.FE.Helpers;

public static class BorrowingHelper
{
    // Helper method to borrow a book
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
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"Error: {ex.Message}");
            Console.ResetColor();
        }
    }

    // Helper method to return a borrowed book
    public static void ReturnBook(
        IReturnService returnService,
        IBorrowingService borrowingService)
    {
        try
        {
            int memberId =
                InputHelper.ReadInt(
                    "Enter Member Id: ");

            bool hasActive =
                ShowActiveBorrowings(
                    borrowingService,
                    memberId);

            if (!hasActive)
            {
                return;
            }

            int borrowingId =
                InputHelper.ReadInt(
                    "Enter Borrowing Id to Return: ");

            returnService.ReturnBook(borrowingId);

            Console.WriteLine(
                "Book Returned Successfully");
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"Error: {ex.Message}");
            Console.ResetColor();
        }
    }

    // Helper method to view the total pending fine for a member
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
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"Error: {ex.Message}");
            Console.ResetColor();
        }
    }

    // Helper method to pay a fine for a specific borrowing
    public static void PayFine(IFineService fineService,IBorrowingService borrowingService)
    {
        try
        {
            int memberId = InputHelper.ReadInt("Enter Member Id: ");

            bool hasActive = ShowActiveBorrowings(borrowingService,memberId);

            if (!hasActive)
            {
                return;
            }

            int borrowingId =InputHelper.ReadInt("Enter Borrowing Id to Pay Fine For: ");
            decimal amount =InputHelper.ReadDecimal("Enter Amount to Pay (₹): ");

            fineService.PayFine(borrowingId, amount);
            Console.WriteLine($"Fine of ₹{amount} paid successfully.");
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"Error: {ex.Message}");
            Console.ResetColor();
        }
    }

    // Helper method to view active borrowings for a member and return true if any are found
    private static bool ShowActiveBorrowings(IBorrowingService borrowingService,int memberId)
    {
        List<Borrowing> activeBorrowings = borrowingService.GetActiveBorrowings(memberId);
        
        if (activeBorrowings.Count == 0)
        {
            Console.WriteLine("No active borrowings found for this member.");
            return false;
        }

        Console.WriteLine("\n----- Active Borrowings -----");
        Console.WriteLine($"{"ID",-6} {"Book Title",-30} {"Borrow Date",-22} {"Due Date",-22}");
        Console.WriteLine(new string('-', 82));

        foreach (var b in activeBorrowings)
        {
            string bookTitle = b.Copy?.Book?.Title ?? "Unknown";
            Console.WriteLine($"{b.Borrowingid,-6} " +$"{bookTitle,-30} " +$"{b.Borrowdate,-22} " +$"{b.Duedate,-22}");
        }

        Console.WriteLine(new string('-', 82) + "\n");
        return true;
    }
}