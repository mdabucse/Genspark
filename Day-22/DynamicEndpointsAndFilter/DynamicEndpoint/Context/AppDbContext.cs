using System;
using Model;
using Microsoft.EntityFrameworkCore;

namespace Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions <AppDbContext> options) : base(options)
    {
        
    }
    public DbSet<Bus> Buses {get;set;}
}
