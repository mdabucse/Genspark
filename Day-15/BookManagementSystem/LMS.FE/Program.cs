using LMS.FE.Configurations;
using LMS.FE.Helpers;
using LMS.FE.Menus;
using LMS.Interfaces.Repositories;
using LMS.Interfaces.Services;
using Microsoft.Extensions.DependencyInjection;

namespace LMS.FE;

public class Program
{
    public static void Main(string[] args)
    {
        ServiceProvider serviceProvider = ServiceConfiguration.ConfigureServices();
        IMemberService memberService = serviceProvider.GetRequiredService<IMemberService>();
        IBookService bookService = serviceProvider.GetRequiredService<IBookService>();
        IBorrowingService borrowingService =serviceProvider.GetRequiredService<IBorrowingService>();
        IReturnService returnService = serviceProvider.GetRequiredService<IReturnService>();
        IFineService fineService = serviceProvider.GetRequiredService<IFineService>();
        IReportService reportService = serviceProvider.GetRequiredService<IReportService>();
        IBookRepository bookRepository = serviceProvider.GetRequiredService<IBookRepository>();

        bool exit = false;
        while (!exit)
        {
            MainMenu.ShowRoleMenu();
            int roleChoice = ReadMenuChoice();

            switch (roleChoice)
            {
                case 1:
                    ShowAdminFlow(
                        memberService,
                        bookService,
                        reportService,
                        bookRepository);
                    break;

                case 2:
                    ShowCustomerFlow(
                        fineService,
                        reportService,
                        bookService,
                        bookRepository,
                        borrowingService,
                        returnService);
                    break;

                case 3:
                    exit = true;
                    break;

                default:
                    Console.WriteLine("Invalid Choice");
                    break;
            }
        }
    }

    // Helper method to read menu choice with validation
    static int ReadMenuChoice()
    {
        string? input = Console.ReadLine();

        if (input == null)
        {
            return 3; 
        }

        if (int.TryParse(input, out int choice))
        {
            return choice;
        }

        return -1;
    }

    // Helper method to add a new member
    static void ShowAdminFlow(
        IMemberService memberService,
        IBookService bookService,
        IReportService reportService,
        IBookRepository bookRepository)
    {
        bool back = false;

        while (!back)
        {
            AdminMenu.Show();
            int choice = ReadMenuChoice();
            switch (choice)
            {
                case 1:
                    MemberHelper.AddMember(memberService);
                    break;

                case 2:
                    MemberHelper.ViewMembers(memberService);
                    break;

                case 3:
                    MemberHelper.SearchMember(memberService);
                    break;

                case 4:
                    MemberHelper.DeactivateMember(memberService);
                    break;

                case 5:
                    BookHelper.AddBook(bookService);
                    break;

                case 6:
                    BookHelper.ViewBooks(bookService, bookRepository);
                    break;

                case 7:
                    BookHelper.SearchBooks(bookService, bookRepository);
                    break;

                case 8:
                    BookHelper.AddBookCopies(bookService);
                    break;

                case 9:
                    ShowReportsFlow(reportService);
                    break;

                case 10:
                    back = true;
                    break;

                default:
                    Console.WriteLine("Invalid Choice");
                    break;
            }
        }
    }

    // Helper method to show customer flow
    static void ShowCustomerFlow(
        IFineService fineService,
        IReportService reportService,
        IBookService bookService,
        IBookRepository bookRepository,
        IBorrowingService borrowingService,
        IReturnService returnService)
    {
        bool back = false;
        while (!back)
        {
            CustomerMenu.Show();
            int choice = ReadMenuChoice();
            switch (choice)
            {
                case 1:
                    BookHelper.SearchBooks(bookService, bookRepository);
                    break;

                case 2:
                    ReportHelper.ShowAvailableBooks(reportService);
                    break;

                case 3:
                    BorrowingHelper.BorrowBook(borrowingService);
                    break;

                case 4:
                    BorrowingHelper.ReturnBook(returnService, borrowingService);
                    break;

                case 5:
                    BorrowingHelper.ViewMemberFine(fineService);
                    break;

                case 6:
                    BorrowingHelper.PayFine(fineService, borrowingService);
                    break;

                case 7:
                    ReportHelper.ShowMemberBorrowingHistory(reportService);
                    break;

                case 8:
                    back = true;
                    break;

                default:
                    Console.WriteLine("Invalid Choice");
                    break;
            }
        }
    }

    // Helper method to add a new member
    static void ShowReportsFlow(IReportService reportService)
    {
        bool back = false;
        while (!back)
        {
            Console.WriteLine("\n===== REPORTS MENU =====");
            Console.WriteLine("1. Overdue Books");
            Console.WriteLine("2. Members With Pending Fine");
            Console.WriteLine("3. Most Borrowed Books");
            Console.WriteLine("4. Available Books");
            Console.WriteLine("5. Member Borrowing History");
            Console.WriteLine("6. Back");
            Console.Write("\nEnter Choice: ");

            int choice = ReadMenuChoice();

            switch (choice)
            {
                case 1:
                    ReportHelper.ShowOverdueBooks(reportService);
                    break;

                case 2:
                    ReportHelper.ShowMembersWithPendingFine(reportService);
                    break;

                case 3:
                    ReportHelper.ShowMostBorrowedBooks(reportService);
                    break;

                case 4:
                    ReportHelper.ShowAvailableBooks(reportService);
                    break;

                case 5:
                    ReportHelper.ShowMemberBorrowingHistory(reportService);
                    break;

                case 6:
                    back = true;
                    break;

                default:
                    Console.WriteLine("Invalid Choice");
                    break;
            }
        }
    }
}