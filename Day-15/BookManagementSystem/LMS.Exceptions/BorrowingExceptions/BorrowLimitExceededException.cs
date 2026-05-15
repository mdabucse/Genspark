namespace LMS.Exceptions.BorrowingExceptions;

public class BorrowLimitExceededException : Exception
{
    // Constructor to initialize the exception with a default message
    public BorrowLimitExceededException()
        : base("Borrow limit exceeded")
    {

    }
}