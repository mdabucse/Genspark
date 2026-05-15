namespace LMS.Exceptions.BookExceptions;

public class BookNotFoundException : Exception
{
    // Constructor to initialize the exception with a default message
    public BookNotFoundException()
        : base("Book not found")
    {

    }
}