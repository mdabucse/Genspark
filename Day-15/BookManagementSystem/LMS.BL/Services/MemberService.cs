using LMS.Interfaces.Repositories;
using LMS.Interfaces.Services;
using LMS.Models.Entities;
using LMS.Exceptions.MemberExceptions;

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
            throw new DuplicateEmailException();
        }

        member.Isactive = true;

        member.Createdat = DateTime.Now;

        _memberRepository.Add(member);
    }

    public List<Member> GetAllMembers()
    {
        return _memberRepository.GetAll();
    }

    public Member? SearchMemberByEmail(string email)
    {
        return _memberRepository.GetMemberByEmail(email);
    }

    public void DeactivateMember(int memberId)
    {
        Member? member =
            _memberRepository.GetById(memberId);

        if (member == null)
        {
            throw new MemberNotFoundException();
        }

        member.Isactive = false;

        _memberRepository.Update(member);
    }
}