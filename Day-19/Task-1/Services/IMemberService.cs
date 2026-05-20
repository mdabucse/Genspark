using Task_1.Models;

namespace Task_1.Services;

public interface IMemberService
{
    void AddMember(Member member);
    List<Member> GetAllMembers();
    Member? GetMemberById(int id);
}
