using Microsoft.AspNetCore.Mvc;
using Task_1.Models;
using Task_1.Services;

namespace Task_1.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MembersController : ControllerBase
{
    private readonly IMemberService _memberService;

    public MembersController(IMemberService memberService)
    {
        _memberService = memberService;
    }

    [HttpPost]
    public IActionResult AddMember([FromBody] Member member)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            _memberService.AddMember(member);
            return Ok(new { message = "Member added successfully" });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet]
    public ActionResult<List<Member>> GetAllMembers()
    {
        return _memberService.GetAllMembers();
    }

    [HttpGet("{id}")]
    public ActionResult<Member> GetMemberById(int id)
    {
        var member = _memberService.GetMemberById(id);
        if (member == null)
        {
            return NotFound();
        }
        return member;
    }
}
