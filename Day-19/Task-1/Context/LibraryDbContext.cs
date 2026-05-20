using Microsoft.EntityFrameworkCore;
using Task_1.Models;

namespace Task_1.Context;

public class LibraryDbContext : DbContext
{
    public LibraryDbContext(DbContextOptions<LibraryDbContext> options)
        : base(options)
    {
    }

    public DbSet<Book> Books { get; set; } = null!;
    public DbSet<Member> Members { get; set; } = null!;
}
