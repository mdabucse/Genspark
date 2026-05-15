using LMS.Context.DbContextFolder;
using LMS.Interfaces.Repositories;
using LMS.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LMS.DAL.Repositories;

public class MemberRepository: GenericRepository<Member>,IMemberRepository
{
    public MemberRepository(LibraryDbContext context): base(context)
    {

    }
    // Override the GetById method to include related Membershiptype data
    public override Member? GetById(int id)
    {
        return _context.Members
                .Include(m => m.Membershiptype)
                .FirstOrDefault(m => m.Memberid == id);
    }

    // Implement the GetMemberByEmail method to retrieve a member by their email address
    public Member? GetMemberByEmail(string email)
    {
        return _context.Members
                       .Include(m => m.Membershiptype)
                       .FirstOrDefault(m => m.Email == email);
    }

    // Implement the GetMemberByPhone method to retrieve a member by their phone number
    public Member? GetMemberByPhone(string phone)
    {
        return _context.Members
                .Include(m => m.Membershiptype)
                .FirstOrDefault(m => m.Phone == phone);
    }
}