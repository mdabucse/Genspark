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

        Console.WriteLine(
            "6. View Borrowing History");

        Console.WriteLine(
            "7. Back");

        Console.Write(
            "\nEnter Choice: ");
    }
}