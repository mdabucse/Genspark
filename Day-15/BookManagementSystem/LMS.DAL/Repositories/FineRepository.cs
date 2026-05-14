using LMS.Context.DbContextFolder;
using LMS.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LMS.DAL.Repositories;

public class FineRepository : IFineRepository
{
    private readonly LibraryDbContext _context;

    public FineRepository(LibraryDbContext context)
    {
        _context = context;
    }

    public decimal CalculateMemberFine(int memberId)
    {
        decimal result =
            _context.Database
                    .SqlQueryRaw<decimal>(
                        $"SELECT calculate_member_fine({memberId})")
                    .AsEnumerable()
                    .FirstOrDefault();

        return result;
    }
}