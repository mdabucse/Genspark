using LMS.Interfaces.Repositories;
using LMS.Interfaces.Services;
using LMS.Models.Entities;

namespace LMS.FE.Helpers;

public static class BookHelper
{
    public static void AddBook(
        IBookService bookService)
    {
        try
        {
            string title =
                InputHelper.ReadString("Enter Title: ");

            string author =
                InputHelper.ReadString("Enter Author: ");

            string isbn =
                InputHelper.ReadString("Enter ISBN: ");

            int publishedYear =
                InputHelper.ReadInt(
                    "Enter Published Year: ");

            int categoryId =
                InputHelper.ReadInt(
                    "Enter Category Id: ");

            Book book = new Book
            {
                Title = title,
                Author = author,
                Isbn = isbn,
                Publishedyear = publishedYear,
                Categoryid = categoryId
            };

            bookService.AddBook(book);

            Console.WriteLine(
                "Book Added Successfully");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }

    public static void ViewBooks(
        IBookService bookService,
        IBookRepository bookRepository)
    {
        List<Book> books =
            bookService.GetAllBooks();

        foreach (var book in books)
        {
            int availableCopies =
                bookRepository
                .GetAvailableCopyCount(book.Bookid);

            Console.WriteLine(
                $"{book.Bookid} | " +
                $"{book.Title} | " +
                $"{book.Author} | " +
                $"Available Copies: {availableCopies}"
            );
        }
    }

    public static void SearchBooks(
        IBookService bookService,
        IBookRepository bookRepository)
    {
        string keyword =
            InputHelper.ReadString(
                "Enter Keyword: ");

        List<Book> books =
            bookService.SearchBooks(keyword);

        foreach (var book in books)
        {
            int availableCopies =
                bookRepository
                .GetAvailableCopyCount(book.Bookid);

            Console.WriteLine(
                $"{book.Bookid} | " +
                $"{book.Title} | " +
                $"{book.Author} | " +
                $"Available Copies: {availableCopies}"
            );
        }
    }

    public static void AddBookCopies(
        IBookService bookService)
    {
        try
        {
            int bookId =
                InputHelper.ReadInt(
                    "Enter Book Id: ");

            int numberOfCopies =
                InputHelper.ReadInt(
                    "Enter Number Of Copies: ");

            bookService.AddBookCopies(
                bookId,
                numberOfCopies);

            Console.WriteLine(
                "Book Copies Added Successfully");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }
}