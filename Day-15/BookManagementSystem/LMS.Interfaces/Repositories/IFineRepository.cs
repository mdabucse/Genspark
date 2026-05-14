namespace LMS.Interfaces.Repositories;

public interface IFineRepository
{
    decimal CalculateMemberFine(int memberId);
}