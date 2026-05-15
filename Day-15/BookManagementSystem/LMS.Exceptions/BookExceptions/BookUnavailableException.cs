namespace LMS.Exceptions.BookExceptions;

public class BookUnavailableException : Exception
{
    public BookUnavailableException()
        : base("No available copies")
    {

    }
}