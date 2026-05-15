namespace LMS.Exceptions.BorrowingExceptions;

public class AlreadyReturnedException : Exception
{
    // Constructor to initialize the exception with a default message
    public AlreadyReturnedException()
        : base("Book already returned")
    {

    }
}