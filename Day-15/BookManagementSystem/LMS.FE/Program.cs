using LMS.BL.Services;
using LMS.Context.DbContextFolder;
using LMS.DAL.Repositories;
using LMS.Models.Entities;

namespace LMS.FE;

public class Program
{
    public static void Main(string[] args)
    {
        LibraryDbContext context =
            new LibraryDbContext();

        MemberRepository memberRepository =
            new MemberRepository(context);

        MemberService memberService =
            new MemberService(memberRepository);

        BookRepository bookRepository =
            new BookRepository(context);

        BookService bookService =
            new BookService(bookRepository);

        BorrowingRepository borrowingRepository =
            new BorrowingRepository(context);

        BorrowingService borrowingService =
            new BorrowingService(
                borrowingRepository,
                memberRepository,
                bookRepository,
                context);

        ReturnService returnService =
            new ReturnService(
                borrowingRepository,
                context);

        FineRepository fineRepository =
            new FineRepository(context);

        FineService fineService =
            new FineService(fineRepository);

        ReportRepository reportRepository =
            new ReportRepository(context);

        ReportService reportService =
            new ReportService(reportRepository);

        bool exit = false;

        while (!exit)
        {
            Console.WriteLine("\n===== Library Management System =====");

            Console.WriteLine("1. Add Member");

            Console.WriteLine("2. View Members");

            Console.WriteLine("3. Search Member");

            Console.WriteLine("4. Deactivate Member");

            Console.WriteLine("5. Add Book");

            Console.WriteLine("6. View Books");

            Console.WriteLine("7. Search Books");

            Console.WriteLine("8. Add Book Copies");

            Console.WriteLine("9. Borrow Book");

            Console.WriteLine("10. Return Book");

            Console.WriteLine("11. View Member Fine");

            Console.WriteLine("12. Overdue Books Report");

            Console.WriteLine("13. Members With Pending Fine");

            Console.WriteLine("14. Most Borrowed Books");

            Console.WriteLine("15. Available Books");

            Console.WriteLine("16. Member Borrowing History");

            Console.WriteLine("17. Exit");

            Console.Write("\nEnter Choice: ");

            int choice = Convert.ToInt32(Console.ReadLine());

            switch (choice)
            {
                case 1:

                    AddMember(memberService);

                    break;

                case 2:

                    ViewMembers(memberService);

                    break;

                case 3:

                    SearchMember(memberService);

                    break;

                case 4:

                    DeactivateMember(memberService);

                    break;

                case 5:

                    AddBook(bookService);

                    break;

                case 6:

                    ViewBooks(bookService, bookRepository);

                    break;

                case 7:

                    SearchBooks(bookService, bookRepository);

                    break;

                case 8:

                    AddBookCopies(bookService);

                    break;

                case 9:

                    BorrowBook(borrowingService);

                    break;

                case 10:

                    ReturnBook(returnService);

                    break;

                case 11:

                    ViewMemberFine(fineService);

                    break;

                case 12:

                    ShowOverdueBooks(reportService);

                    break;

                case 13:

                    ShowMembersWithPendingFine(reportService);

                    break;

                case 14:

                    ShowMostBorrowedBooks(reportService);

                    break;

                case 15:

                    ShowAvailableBooks(reportService);

                    break;

                case 16:

                    ShowMemberBorrowingHistory(reportService);

                    break;

                case 17:

                    exit = true;

                    break;

                default:

                    Console.WriteLine("Invalid Choice");

                    break;
            }
        }

        static void AddMember(MemberService memberService)
        {
            try
            {
                Console.Write("Enter Name: ");

                string name = Console.ReadLine()!;

                Console.Write("Enter Email: ");

                string email = Console.ReadLine()!;

                Console.Write("Enter Phone: ");

                string phone = Console.ReadLine()!;

                Console.Write("Enter Address: ");

                string address = Console.ReadLine()!;

                Console.Write("Enter Membership Type Id: ");

                int membershipTypeId =
                    Convert.ToInt32(Console.ReadLine());

                Member member = new Member
                {
                    Name = name,
                    Email = email,
                    Phone = phone,
                    Address = address,
                    Membershiptypeid = membershipTypeId
                };

                memberService.AddMember(member);

                Console.WriteLine("Member Added Successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        static void ViewMembers(MemberService memberService)
        {
            List<Member> members =
                memberService.GetAllMembers();

            foreach (var member in members)
            {
                Console.WriteLine(
                    $"{member.Memberid} | " +
                    $"{member.Name} | " +
                    $"{member.Email} | " +
                    $"{member.Phone} | " +
                    $"{member.Isactive}"
                );
            }
        }

        static void SearchMember(MemberService memberService)
        {
            Console.Write("Enter Email: ");

            string email = Console.ReadLine()!;

            Member? member =
                memberService.SearchMemberByEmail(email);

            if (member == null)
            {
                Console.WriteLine("Member not found");

                return;
            }

            Console.WriteLine(
                $"{member.Memberid} | " +
                $"{member.Name} | " +
                $"{member.Email} | " +
                $"{member.Phone}"
            );
        }

        static void DeactivateMember(MemberService memberService)
        {
            try
            {
                Console.Write("Enter Member Id: ");

                int memberId =
                    Convert.ToInt32(Console.ReadLine());

                memberService.DeactivateMember(memberId);

                Console.WriteLine("Member Deactivated Successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        static void AddBook(BookService bookService)
        {
            try
            {
                Console.Write("Enter Title: ");

                string title = Console.ReadLine()!;

                Console.Write("Enter Author: ");

                string author = Console.ReadLine()!;

                Console.Write("Enter ISBN: ");

                string isbn = Console.ReadLine()!;

                Console.Write("Enter Published Year: ");

                int publishedYear =
                    Convert.ToInt32(Console.ReadLine());

                Console.Write("Enter Category Id: ");

                int categoryId =
                    Convert.ToInt32(Console.ReadLine());

                Book book = new Book
                {
                    Title = title,
                    Author = author,
                    Isbn = isbn,
                    Publishedyear = publishedYear,
                    Categoryid = categoryId
                };

                bookService.AddBook(book);

                Console.WriteLine("Book Added Successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        static void ViewBooks(
            BookService bookService,
            BookRepository bookRepository)
        {
            List<Book> books =
                bookService.GetAllBooks();

            foreach (var book in books)
            {
                int availableCopies =
                    bookRepository.GetAvailableCopyCount(book.Bookid);

                Console.WriteLine(
                    $"{book.Bookid} | " +
                    $"{book.Title} | " +
                    $"{book.Author} | " +
                    $"Available Copies: {availableCopies}"
                );
            }
        }

        static void SearchBooks(
            BookService bookService,
            BookRepository bookRepository)
        {
            Console.Write("Enter Keyword: ");

            string keyword = Console.ReadLine()!;

            List<Book> books =
                bookService.SearchBooks(keyword);

            foreach (var book in books)
            {
                int availableCopies =
                    bookRepository.GetAvailableCopyCount(book.Bookid);

                Console.WriteLine(
                    $"{book.Bookid} | " +
                    $"{book.Title} | " +
                    $"{book.Author} | " +
                    $"Available Copies: {availableCopies}"
                );
            }
        }

        static void AddBookCopies(BookService bookService)
        {
            try
            {
                Console.Write("Enter Book Id: ");

                int bookId =
                    Convert.ToInt32(Console.ReadLine());

                Console.Write("Enter Number Of Copies: ");

                int numberOfCopies =
                    Convert.ToInt32(Console.ReadLine());

                bookService.AddBookCopies(
                    bookId,
                    numberOfCopies
                );

                Console.WriteLine("Book Copies Added Successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        static void BorrowBook(
            BorrowingService borrowingService)
        {
            try
            {
                Console.Write("Enter Member Id: ");

                int memberId =
                    Convert.ToInt32(Console.ReadLine());

                Console.Write("Enter Book Id: ");

                int bookId =
                    Convert.ToInt32(Console.ReadLine());

                borrowingService.BorrowBook(
                    memberId,
                    bookId);

                Console.WriteLine("Book Borrowed Successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        static void ReturnBook(
            ReturnService returnService)
        {
            try
            {
                Console.Write("Enter Borrowing Id: ");

                int borrowingId =
                    Convert.ToInt32(Console.ReadLine());

                returnService.ReturnBook(
                    borrowingId);

                Console.WriteLine("Book Returned Successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
        static void ViewMemberFine(
        FineService fineService)
        {
            try
            {
                Console.Write("Enter Member Id: ");

                int memberId =
                    Convert.ToInt32(Console.ReadLine());

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
        static void ShowOverdueBooks(
        ReportService reportService)
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

        static void ShowMembersWithPendingFine(
            ReportService reportService)
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
        static void ShowMostBorrowedBooks(
            ReportService reportService)
        {
            var books =
                reportService.GetMostBorrowedBooks();

            foreach (var item in books)
            {
                Console.WriteLine(item);
            }
        }
        static void ShowAvailableBooks(
            ReportService reportService)
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
        static void ShowMemberBorrowingHistory(
            ReportService reportService)
        {
            Console.Write("Enter Member Id: ");

            int memberId =
                Convert.ToInt32(Console.ReadLine());

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
}