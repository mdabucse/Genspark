namespace LMS.Interfaces.Repositories;

public interface IFineRepository
{
    decimal CalculateMemberFine(int memberId);
    void PayFine(int borrowingId, decimal amount);
}