using System;
using System.Collections.Generic;

namespace LMS.Models.Entities;

public partial class Bookcopy
{
    public int Copyid { get; set; }

    public int Bookid { get; set; }

    public bool? Isavailable { get; set; }

    public bool? Isdamaged { get; set; }

    public virtual Book Book { get; set; } = null!;

    public virtual ICollection<Borrowing> Borrowings { get; set; } = new List<Borrowing>();
}
