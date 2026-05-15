namespace LMS.Exceptions.BorrowingExceptions;

public class AlreadyBorrowedException : Exception
{
    public AlreadyBorrowedException()
        : base("Member already borrowed this book")
    {

    }
}