namespace LMS.Exceptions.BorrowingExceptions;

public class BorrowingNotFoundException : Exception
{
    public BorrowingNotFoundException()
        : base("Borrowing record not found")
    {

    }
}