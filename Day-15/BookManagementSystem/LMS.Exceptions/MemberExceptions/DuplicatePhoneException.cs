namespace LMS.Exceptions.MemberExceptions;

public class DuplicatePhoneException : Exception
{
    // Constructor to initialize the exception with a default message
    public DuplicatePhoneException(): base("Phone number already exists")
    {
    }
}
