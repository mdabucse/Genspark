namespace LMS.Exceptions.BorrowingExceptions;

public class AlreadyBorrowedException : Exception
{
    // Constructor to initialize the exception with a default message
    public AlreadyBorrowedException()
        : base("Member already borrowed this book")
    {

    }
}