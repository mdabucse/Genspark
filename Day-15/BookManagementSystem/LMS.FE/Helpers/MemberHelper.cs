using LMS.Interfaces.Services;
using LMS.Models.Entities;

namespace LMS.FE.Helpers;

public static class MemberHelper
{
    public static void AddMember(
        IMemberService memberService)
    {
        try
        {
            string name =
                InputHelper.ReadString("Enter Name: ");

            string email =
                InputHelper.ReadString("Enter Email: ");

            string phone =
                InputHelper.ReadString("Enter Phone: ");

            string address =
                InputHelper.ReadString("Enter Address: ");

            int membershipTypeId =
                InputHelper.ReadInt(
                    "Enter Membership Type Id: ");

            Member member = new Member
            {
                Name = name,
                Email = email,
                Phone = phone,
                Address = address,
                Membershiptypeid = membershipTypeId
            };

            memberService.AddMember(member);

            Console.WriteLine(
                "Member Added Successfully");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }

    public static void ViewMembers(
        IMemberService memberService)
    {
        List<Member> members =
            memberService.GetAllMembers();

        foreach (var member in members)
        {
            Console.WriteLine(
                $"{member.Memberid} | " +
                $"{member.Name} | " +
                $"{member.Email} | " +
                $"{member.Phone}"
            );
        }
    }

    public static void SearchMember(
    IMemberService memberService)
{
    string email =
        InputHelper.ReadString(
            "Enter Email: ");

    Member? member =
        memberService.SearchMemberByEmail(email);

    if (member == null)
    {
        Console.WriteLine("Member not found");

        return;
    }

    Console.WriteLine(
        $"{member.Memberid} | " +
        $"{member.Name} | " +
        $"{member.Email} | " +
        $"{member.Phone}"
    );
}

public static void DeactivateMember(
    IMemberService memberService)
{
    try
    {
        int memberId =
            InputHelper.ReadInt(
                "Enter Member Id: ");

        memberService.DeactivateMember(memberId);

        Console.WriteLine(
            "Member Deactivated Successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
    }
}
}