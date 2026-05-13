using Microsoft.EntityFrameworkCore;
using NotificationAppModelLibrary;

namespace NotificationAppDALLibrary.Contexts
{
    public class AppDbContext : DbContext
    {
        // Configure PostgreSQL Connection
        protected override void OnConfiguring(
            DbContextOptionsBuilder optionsBuilder
        )
        {
            optionsBuilder.UseNpgsql(
                "Host=localhost;Port=5432;Database=notificationdb;Username=mohamedabubakkars;Password=root"
            );
        }

        // Tables
        public DbSet<UserDetails> Users { get; set; }

        public DbSet<Account> Accounts { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        // Fluent API Configuration
        protected override void OnModelCreating(
            ModelBuilder modelBuilder
        )
        {
            // USER TABLE
            modelBuilder.Entity<UserDetails>(entity =>
            {
                entity.HasKey(u => u.Id);

                entity.Property(u => u.UserName)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(u => u.Email)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(u => u.PhoneNumber)
                      .HasMaxLength(20);
            });

            // ACCOUNT TABLE
            modelBuilder.Entity<Account>(entity =>
            {
                entity.HasKey(a => a.AccountNumber);

                entity.Property(a => a.AccountNumber)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.Property(a => a.Balance)
                      .HasColumnType("decimal(18,2)");

                entity.Property(a => a.CreatedDate)
                      .HasColumnType(
                          "timestamp without time zone"
                      );

                // One User -> Many Accounts
                entity.HasOne(a => a.User)
                      .WithMany(u => u.Accounts)
                      .HasForeignKey(a => a.UserDetailsId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // NOTIFICATION TABLE
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(n => n.Id);

                entity.Property(n => n.Message)
                      .IsRequired();

                entity.Property(n => n.NotificationType)
                      .HasMaxLength(50);

                entity.Property(n => n.SentDate)
                      .HasColumnType(
                          "timestamp without time zone"
                      );

                // One Account -> Many Notifications
                entity.HasOne(n => n.Account)
                      .WithMany(a => a.Notifications)
                      .HasForeignKey(n => n.AccountNumber)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}