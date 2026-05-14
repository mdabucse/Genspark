using LMS.Interfaces.Repositories;
using LMS.Interfaces.Services;

namespace LMS.BL.Services;

public class FineService : IFineService
{
    private readonly IFineRepository _fineRepository;

    public FineService(IFineRepository fineRepository)
    {
        _fineRepository = fineRepository;
    }

    public decimal GetMemberFine(int memberId)
    {
        return _fineRepository
               .CalculateMemberFine(memberId);
    }
}