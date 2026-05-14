using System;
using System.Collections.Generic;

namespace LMS.Models.Entities;

public partial class Bookcategory
{
    public int Categoryid { get; set; }

    public string Categoryname { get; set; } = null!;

    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}
