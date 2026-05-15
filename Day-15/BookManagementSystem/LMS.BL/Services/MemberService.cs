using LMS.Interfaces.Repositories;
using LMS.Interfaces.Services;
using LMS.Models.Entities;
using LMS.Exceptions.MemberExceptions;

namespace LMS.BL.Services;

public class MemberService : IMemberService
{
    private readonly IMemberRepository _memberRepository;

    // Injecting dependencies
    public MemberService(IMemberRepository memberRepository)
    {
        _memberRepository = memberRepository;
    }

    // Adding the member
    public void AddMember(Member member)
    {
        Member? existingByEmail = _memberRepository.GetMemberByEmail(member.Email);

        if (existingByEmail != null)
        {
            throw new DuplicateEmailException();
        }

        Member? existingByPhone = _memberRepository.GetMemberByPhone(member.Phone);

        if (existingByPhone != null)
        {
            throw new DuplicatePhoneException();
        }

        member.Isactive = true;
        member.Createdat = DateTime.Now;
        _memberRepository.Add(member);
    }

    // Getting all the members
    public List<Member> GetAllMembers()
    {
        return _memberRepository.GetAll();
    }

    // Searching the member by email
    public Member? SearchMemberByEmail(string email)
    {
        return _memberRepository.GetMemberByEmail(email);
    }

    // Deactivating the member
    public void DeactivateMember(int memberId)
    {
        Member? member = _memberRepository.GetById(memberId);
        if (member == null)
        {
            throw new MemberNotFoundException();
        }
        member.Isactive = false;
        _memberRepository.Update(member);
    }
}