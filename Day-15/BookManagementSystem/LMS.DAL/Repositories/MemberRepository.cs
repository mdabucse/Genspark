using LMS.Context.DbContextFolder;
using LMS.Interfaces.Repositories;
using LMS.Models.Entities;

namespace LMS.DAL.Repositories;

public class MemberRepository
    : GenericRepository<Member>,
      IMemberRepository
{
    public MemberRepository(
        LibraryDbContext context)
        : base(context)
    {

    }

    public Member? GetMemberByEmail(string email)
    {
        return _context.Members
                       .FirstOrDefault(m =>
                            m.Email == email);
    }
}