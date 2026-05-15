namespace LMS.Exceptions.MemberExceptions;

public class DuplicateEmailException : Exception
{
    public DuplicateEmailException()
        : base("Email already exists")
    {

    }
}