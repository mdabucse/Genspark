using Task_1.Models;
using Task_1.Repository;

namespace Task_1.Services;

public class MemberService : IMemberService
{
    private readonly IMemberRepository _memberRepository;

    public MemberService(IMemberRepository memberRepository)
    {
        _memberRepository = memberRepository;
    }

    public void AddMember(Member member)
    {
        ValidateMember(member);
        _memberRepository.Add(member);
    }

    public List<Member> GetAllMembers()
    {
        return _memberRepository.GetAll();
    }

    public Member? GetMemberById(int id)
    {
        return _memberRepository.GetById(id);
    }

    private static void ValidateMember(Member member)
    {
        if (string.IsNullOrWhiteSpace(member.FullName))
        {
            throw new ArgumentException("Member full name should not be empty.");
        }

        if (string.IsNullOrWhiteSpace(member.Email))
        {
            throw new ArgumentException("Email should not be empty.");
        }

        if (string.IsNullOrWhiteSpace(member.PhoneNumber))
        {
            throw new ArgumentException("Phone number should not be empty.");
        }

        if (member.MembershipDate == default)
        {
            throw new ArgumentException("Membership date should not be empty.");
        }
    }
}
