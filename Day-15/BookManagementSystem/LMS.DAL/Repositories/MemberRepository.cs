using LMS.Context.DbContextFolder;
using LMS.Interfaces.Repositories;
using LMS.Models.Entities;

namespace LMS.DAL.Repositories;
public class MemberRepository : IMemberRepository
{
    private readonly LibraryDbContext _context;
    public MemberRepository(LibraryDbContext context)
    {
        _context = context;
    }
    public void AddMember(Member member)
    {
        _context.Members.Add(member);
        _context.SaveChanges();
    }
    public List<Member> GetAllMembers()
    {
        return _context.Members.ToList();
    }
    public Member? GetMemberById(int memberId)
    {
        return _context.Members
                       .FirstOrDefault(m => m.Memberid == memberId);
    }
    public Member? GetMemberByEmail(string email)
    {
        return _context.Members
                       .FirstOrDefault(m => m.Email == email);
    }
    public void UpdateMember(Member member)
    {
        _context.Members.Update(member);
        _context.SaveChanges();
    }
}