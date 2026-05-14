using LMS.Interfaces.Repositories;
using LMS.Interfaces.Services;
using LMS.Models.Entities;

namespace LMS.BL.Services;

public class MemberService : IMemberService
{
    private readonly IMemberRepository _memberRepository;

    public MemberService(IMemberRepository memberRepository)
    {
        _memberRepository = memberRepository;
    }

    public void AddMember(Member member)
    {
        Member? existingMember =
            _memberRepository.GetMemberByEmail(member.Email);

        if (existingMember != null)
        {
            throw new Exception("Email already exists");
        }

        member.Isactive = true;

        member.Createdat = DateTime.Now;

        _memberRepository.AddMember(member);
    }

    public List<Member> GetAllMembers()
    {
        return _memberRepository.GetAllMembers();
    }

    public Member? SearchMemberByEmail(string email)
    {
        return _memberRepository.GetMemberByEmail(email);
    }

    public void DeactivateMember(int memberId)
    {
        Member? member =
            _memberRepository.GetMemberById(memberId);

        if (member == null)
        {
            throw new Exception("Member not found");
        }

        member.Isactive = false;

        _memberRepository.UpdateMember(member);
    }
}