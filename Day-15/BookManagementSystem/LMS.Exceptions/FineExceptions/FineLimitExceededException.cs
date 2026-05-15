namespace LMS.Exceptions.FineExceptions;

public class FineLimitExceededException : Exception
{
    public FineLimitExceededException()
        : base("Pending fine exceeds limit")
    {

    }
}