namespace LMS.FE.Menus;

public static class CustomerMenu
{
    public static void Show()
    {
        Console.WriteLine(
            "\n===== CUSTOMER MENU =====");

        Console.WriteLine(
            "1. Search Books");

        Console.WriteLine(
            "2. View Available Books");

        Console.WriteLine(
            "3. Borrow Book");

        Console.WriteLine(
            "4. Return Book");

        Console.WriteLine(
            "5. View My Fine");

        // BUG FIX: Added Pay Fine option — was missing despite being a core requirement
        Console.WriteLine(
            "6. Pay Fine");

        Console.WriteLine(
            "7. View Borrowing History");

        Console.WriteLine(
            "8. Back");

        Console.Write(
            "\nEnter Choice: ");
    }
}