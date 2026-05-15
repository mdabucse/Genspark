namespace LMS.Exceptions.MemberExceptions;

public class MemberNotFoundException : Exception
{
    // Constructor to initialize the exception with a default message
    public MemberNotFoundException(): base("Member not found")
    {

    }
}