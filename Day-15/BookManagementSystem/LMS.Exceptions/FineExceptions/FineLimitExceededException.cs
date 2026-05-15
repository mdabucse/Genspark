namespace LMS.Exceptions.FineExceptions;

public class FineLimitExceededException : Exception
{
    // Constructor to initialize the exception with a default message
    public FineLimitExceededException(): base("Pending fine exceeds limit")
    {

    }
}