using Microsoft.EntityFrameworkCore;
using FluentAPI.Models;

namespace FluentAPI.Contexts
{
    public class BankingContext : DbContext
    {
        // Database Connection
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(
                "Host=localhost;Port=5432;Database=bankingdb;Username=mohamedabubakkars;Password=root"
            );
        }

        // Tables
        public DbSet<Customer> customers { get; set; }

        public DbSet<Account> accounts { get; set; }

        // Model Configuration
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Customer>(c =>
            {
                // Primary Key
                c.HasKey(c => c.Id);

                // PostgreSQL Date Type
                c.Property(c => c.DateOfBirth)
                 .HasColumnType("timestamp without time zone");

                // Seed Data
                c.HasData(
                    new Customer()
                    {
                        Id = 101,
                        Name = "Ramu",
                        Phone = "9876543210",
                        Email = "ramu@gmail.com",
                        DateOfBirth = DateTime.Now,
                        Status = "Active"
                    }
                );
            });

            modelBuilder.Entity<Account>(a =>
            {
                // Primary Key
                a.HasKey(a => a.AccountNumber);

                // One-to-Many Relationship
                a.HasOne(a => a.Customer)
                 .WithMany(c => c.Accounts)
                 .HasForeignKey(a => a.CustomerId)
                 .HasConstraintName("FK_Account_Customer")
                 .OnDelete(DeleteBehavior.Restrict);

                // PostgreSQL Date Type
                a.Property(a => a.LastAccessed)
                 .HasColumnType("timestamp without time zone");

                // Seed Data
                a.HasData(
                    new Account()
                    {
                        AccountNumber = "0009998877",
                        CustomerId = 101,
                        Balance = 134.3M,
                        LastAccessed = DateTime.Now,
                        Status = "Active"
                    }
                );
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}