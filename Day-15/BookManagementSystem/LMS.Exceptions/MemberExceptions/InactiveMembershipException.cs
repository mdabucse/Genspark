namespace LMS.Exceptions.MemberExceptions;

public class InactiveMembershipException : Exception
{
    public InactiveMembershipException()
        : base("Membership inactive")
    {

    }
}