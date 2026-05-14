using System;
using System.Collections.Generic;

namespace TransactionsSP.Models;

public partial class ProductsAboveAveragePrice
{
    public string? Productname { get; set; }

    public decimal? Unitprice { get; set; }
}
