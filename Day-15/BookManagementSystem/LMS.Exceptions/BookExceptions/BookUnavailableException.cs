namespace LMS.Exceptions.BookExceptions;

public class BookUnavailableException : Exception
{
    // Constructor to initialize the exception with a default message
    public BookUnavailableException()
        : base("No available copies")
    {

    }
}