namespace LMS.FE.Menus;

public static class AdminMenu
{
    public static void Show()
    {
        Console.WriteLine(
            "\n===== ADMIN MENU =====");

        Console.WriteLine(
            "1. Add Member");

        Console.WriteLine(
            "2. View Members");

        Console.WriteLine(
            "3. Search Member");

        Console.WriteLine(
            "4. Deactivate Member");

        Console.WriteLine(
            "5. Add Book");

        Console.WriteLine(
            "6. View Books");

        Console.WriteLine(
            "7. Search Books");

        Console.WriteLine(
            "8. Add Book Copies");

        Console.WriteLine(
            "9. Reports");

        Console.WriteLine(
            "10. Back");

        Console.Write(
            "\nEnter Choice: ");
    }
}