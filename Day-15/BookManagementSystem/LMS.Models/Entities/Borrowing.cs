using System;
using System.Collections.Generic;

namespace LMS.Models.Entities;

public partial class Borrowing
{
    public int Borrowingid { get; set; }

    public int Memberid { get; set; }

    public int Copyid { get; set; }

    public DateTime? Borrowdate { get; set; }

    public DateTime Duedate { get; set; }

    public DateTime? Returndate { get; set; }

    public bool? Isreturned { get; set; }

    public decimal? Fineamount { get; set; }

    public virtual Bookcopy Copy { get; set; } = null!;

    public virtual ICollection<Finepayment> Finepayments { get; set; } = new List<Finepayment>();

    public virtual Member Member { get; set; } = null!;
}
