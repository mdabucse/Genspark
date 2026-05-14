using System;
using System.Collections.Generic;

namespace LMS.Models.Entities;

public partial class Membershiptype
{
    public int Membershiptypeid { get; set; }

    public string Typename { get; set; } = null!;

    public int Maxborrowlimit { get; set; }

    public int Maxborrowdays { get; set; }

    public virtual ICollection<Member> Members { get; set; } = new List<Member>();
}
