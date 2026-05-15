namespace LMS.Exceptions.BorrowingExceptions;

public class AlreadyReturnedException : Exception
{
    public AlreadyReturnedException()
        : base("Book already returned")
    {

    }
}