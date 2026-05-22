using Microsoft.EntityFrameworkCore;
using Models;
namespace Context;

public class UserContext : DbContext
{
    public UserContext (DbContextOptions<UserContext> options): base(options)
    {
    }
    public DbSet <User> User{get;set;}
}