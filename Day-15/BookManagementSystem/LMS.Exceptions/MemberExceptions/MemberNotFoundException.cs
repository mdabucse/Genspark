namespace LMS.Exceptions.MemberExceptions;

public class MemberNotFoundException : Exception
{
    public MemberNotFoundException()
        : base("Member not found")
    {

    }
}