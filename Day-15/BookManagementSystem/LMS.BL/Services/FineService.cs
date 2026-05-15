using LMS.Interfaces.Repositories;
using LMS.Interfaces.Services;
using LMS.Exceptions.BorrowingExceptions;
using LMS.Models.Entities;

namespace LMS.BL.Services;

public class FineService : IFineService
{
    private readonly IFineRepository _fineRepository;

    // Injecting dependencies
    public FineService(IFineRepository fineRepository)
    {
        _fineRepository = fineRepository;
    }

    // Getting the member's fine
    public decimal GetMemberFine(int memberId)
    {
        return _fineRepository.CalculateMemberFine(memberId);
    }

    // Paying the fine

    public void PayFine(int borrowingId, decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Payment amount must be greater than zero.");
        }

        _fineRepository.PayFine(borrowingId, amount);
    }
}