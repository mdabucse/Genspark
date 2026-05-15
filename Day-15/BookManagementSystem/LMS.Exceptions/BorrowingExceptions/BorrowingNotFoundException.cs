namespace LMS.Exceptions.BorrowingExceptions;

public class BorrowingNotFoundException : Exception
{
    // Constructor to initialize the exception with a default message
    public BorrowingNotFoundException()
        : base("Borrowing record not found")
    {

    }
}