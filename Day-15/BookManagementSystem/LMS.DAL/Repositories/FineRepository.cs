using LMS.Context.DbContextFolder;
using LMS.Interfaces.Repositories;
using LMS.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LMS.DAL.Repositories;

public class FineRepository : IFineRepository
{
    private readonly LibraryDbContext _context;

    public FineRepository(LibraryDbContext context)
    {
        _context = context;
    }

    // Calculate the member fine
    public decimal CalculateMemberFine(int memberId)
    {
        decimal result =
            _context.Database
                    .SqlQueryRaw<decimal>(
                        $"SELECT calculate_member_fine({memberId})")
                    .AsEnumerable()
                    .FirstOrDefault();

        decimal totalPaid =
            _context.Finepayments
                    .Where(fp =>
                        fp.Borrowing.Memberid == memberId)
                    .Sum(fp => (decimal?)fp.Amountpaid) ?? 0;

        return Math.Max(0, result - totalPaid);
    }

    // Pay the fine (If it haves)
    public void PayFine(int borrowingId, decimal amount)
    {
        Finepayment payment = new Finepayment
        {
            Borrowingid = borrowingId,
            Amountpaid = amount,
            Paiddate = DateTime.Now
        };

        _context.Finepayments.Add(payment);
        _context.SaveChanges();
    }
}