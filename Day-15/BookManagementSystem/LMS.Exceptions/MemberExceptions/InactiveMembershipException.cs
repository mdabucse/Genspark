namespace LMS.Exceptions.MemberExceptions;

public class InactiveMembershipException : Exception
{
    // Constructor to initialize the exception with a default message
    public InactiveMembershipException(): base("Membership inactive")
    {

    }
}