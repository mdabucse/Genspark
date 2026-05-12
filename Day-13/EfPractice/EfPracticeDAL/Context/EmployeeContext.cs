using System;
using Microsoft.EntityFrameworkCore;
using EfPractice.Model;


namespace EfPractice.DAL
{
    public class EmployeeContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=bankingdb;Username=mohamedabubakkars;Password=root");
        }
        public DbSet<Employee> employees {get;set;}
    }
}
