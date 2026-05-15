using LMS.Models.Entities;

namespace LMS.Interfaces.Services;

public interface IMemberService
{
    void AddMember(Member member);
    List<Member> GetAllMembers();
    Member? SearchMemberByEmail(string email);
    void DeactivateMember(int memberId);
}