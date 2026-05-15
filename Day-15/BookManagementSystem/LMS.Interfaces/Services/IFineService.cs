namespace LMS.Interfaces.Services;

public interface IFineService
{
    decimal GetMemberFine(int memberId);
    void PayFine(int borrowingId, decimal amount);
}