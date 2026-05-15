using System;
using System.Collections.Generic;

namespace LMS.Models.Entities;

public partial class Member
{
    public int Memberid { get; set; }
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string? Address { get; set; }
    public bool? Isactive { get; set; }
    public int Membershiptypeid { get; set; }
    public DateTime? Createdat { get; set; }
    public virtual ICollection<Borrowing> Borrowings { get; set; } = new List<Borrowing>();
    public virtual Membershiptype Membershiptype { get; set; } = null!;
}
