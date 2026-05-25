using Microsoft.EntityFrameworkCore;
using Context;
using Model;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultString"));
});

var app = builder.Build();

app.MapGet("/buses", (AppDbContext db,string? from,string? to,bool? isAC,int pageNumber = 1,int pageSize = 5) =>
{
    // Prevent huge page size
    pageSize = Math.Min(pageSize, 50);

    // Build dynamic query
    var query = db.Buses.AsQueryable();

    // Filtering
    if (!string.IsNullOrEmpty(from))
    {
        query = query.Where(x => x.From == from);
    }

    if (!string.IsNullOrEmpty(to))
    {
        query = query.Where(x => x.To == to);
    }

    if (isAC.HasValue)
    {
        query = query.Where(x => x.IsAC == isAC.Value);
    }

    // Total records before pagination
    var totalRecords = query.Count();

    // Pagination
    var buses = query
        .OrderBy(x => x.Id )
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
        .ToList();

    return Results.Ok(new
    {
        TotalRecords = totalRecords,
        PageNumber = pageNumber,
        PageSize = pageSize,
        Data = buses
    });
});

app.Run();