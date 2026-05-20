using Task_1.Context;
using Task_1.Models;

namespace Task_1.Repository;

public class MemberRepository : GenericRepository<Member>, IMemberRepository
{
    public MemberRepository(LibraryDbContext context)
        : base(context)
    {
    }
}
