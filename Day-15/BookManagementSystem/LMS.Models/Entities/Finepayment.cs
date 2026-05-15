using System;
using System.Collections.Generic;

namespace LMS.Models.Entities;

public partial class Finepayment
{
    public int Paymentid { get; set; }
    public int Borrowingid { get; set; }
    public decimal Amountpaid { get; set; }
    public DateTime? Paiddate { get; set; }
    public virtual Borrowing Borrowing { get; set; } = null!;
}
