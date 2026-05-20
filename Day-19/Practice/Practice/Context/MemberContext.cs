using Model;
using Microsoft.EntityFrameworkCore;

namespace DbContexFolder;
public class MemberContext : DbContext
{
    public MemberContext(DbContextOptions<MemberContext> options) : base(options)
    {
    }  
    public DbSet<Member> Members { get; set; }
    public DbSet<Book> Books {get; set;}
}