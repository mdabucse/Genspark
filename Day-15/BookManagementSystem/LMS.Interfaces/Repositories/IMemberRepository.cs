using LMS.Models.Entities;

namespace LMS.Interfaces.Repositories;

public interface IMemberRepository
    : IGenericRepository<Member>
{
    Member? GetMemberByEmail(string email);
}