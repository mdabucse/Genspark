namespace LMS.Exceptions.BorrowingExceptions;

public class BorrowLimitExceededException : Exception
{
    public BorrowLimitExceededException()
        : base("Borrow limit exceeded")
    {

    }
}