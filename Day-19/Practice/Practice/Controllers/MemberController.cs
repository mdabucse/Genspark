using System;
using IInterfaces;
using Microsoft.AspNetCore.Mvc;
using Model;
using Repository;

namespace Controllers;
[ApiController]
[Route("api/[controller]")]
public class MemberController : ControllerBase
{
    private readonly IGenericRepository<Member> _memberRepository;
    public MemberController(IGenericRepository<Member> memberRepository)
    {
        _memberRepository = memberRepository;
    }

    [HttpPost]
    public IActionResult CreateMember(Member member)
    {
        _memberRepository.Add(member);
        return Ok(member);
    }

    [HttpGet]
    public List<Member> GetAll()
    {
        return _memberRepository.GetAll();
    }
}