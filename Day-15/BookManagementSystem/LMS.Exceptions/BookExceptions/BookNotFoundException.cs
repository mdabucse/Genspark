namespace LMS.Exceptions.BookExceptions;

public class BookNotFoundException : Exception
{
    public BookNotFoundException()
        : base("Book not found")
    {

    }
}