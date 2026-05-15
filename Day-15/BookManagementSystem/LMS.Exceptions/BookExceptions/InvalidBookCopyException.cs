namespace LMS.Exceptions.BookExceptions;

public class InvalidBookCopyException : Exception
{
    // Constructor to initialize the exception with a default message
    public InvalidBookCopyException()
        : base("Invalid book copy")
    {

    }
}