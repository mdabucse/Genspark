using LMS.Models.Entities;

namespace LMS.Interfaces.Repositories;

public interface IMemberRepository
{
    void AddMember(Member member);
    List<Member> GetAllMembers();
    Member? GetMemberById(int memberId);
    Member? GetMemberByEmail(string email);
    void UpdateMember(Member member);
}