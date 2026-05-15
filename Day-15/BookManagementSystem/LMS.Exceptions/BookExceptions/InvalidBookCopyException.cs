namespace LMS.Exceptions.BookExceptions;

public class InvalidBookCopyException : Exception
{
    public InvalidBookCopyException()
        : base("Invalid book copy")
    {

    }
}