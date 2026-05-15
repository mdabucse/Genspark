using System;
using System.Collections.Generic;
using LMS.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LMS.Context.DbContextFolder;

public partial class LibraryDbContext : DbContext
{
    public LibraryDbContext()
    {
    }

    public LibraryDbContext(DbContextOptions<LibraryDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Book> Books { get; set; }

    public virtual DbSet<Bookcategory> Bookcategories { get; set; }

    public virtual DbSet<Bookcopy> Bookcopies { get; set; }

    public virtual DbSet<Borrowing> Borrowings { get; set; }

    public virtual DbSet<Finepayment> Finepayments { get; set; }

    public virtual DbSet<Member> Members { get; set; }

    public virtual DbSet<Membershiptype> Membershiptypes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=librarydb;Username=mohamedabubakkars;Password=root");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.Bookid).HasName("book_pkey");

            entity.ToTable("book");

            entity.HasIndex(e => e.Isbn, "book_isbn_key").IsUnique();

            entity.Property(e => e.Bookid).HasColumnName("bookid");
            entity.Property(e => e.Author)
                .HasMaxLength(100)
                .HasColumnName("author");
            entity.Property(e => e.Categoryid).HasColumnName("categoryid");
            entity.Property(e => e.Isbn)
                .HasMaxLength(20)
                .HasColumnName("isbn");
            entity.Property(e => e.Publishedyear).HasColumnName("publishedyear");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");

            entity.HasOne(d => d.Category).WithMany(p => p.Books)
                .HasForeignKey(d => d.Categoryid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_category");
        });

        modelBuilder.Entity<Bookcategory>(entity =>
        {
            entity.HasKey(e => e.Categoryid).HasName("bookcategory_pkey");
            entity.ToTable("bookcategory");
            entity.HasIndex(e => e.Categoryname, "bookcategory_categoryname_key").IsUnique();
            entity.Property(e => e.Categoryid).HasColumnName("categoryid");
            entity.Property(e => e.Categoryname)
                .HasMaxLength(100)
                .HasColumnName("categoryname");
        });

        modelBuilder.Entity<Bookcopy>(entity =>
        {
            entity.HasKey(e => e.Copyid).HasName("bookcopy_pkey");
            entity.ToTable("bookcopy");
            entity.Property(e => e.Copyid).HasColumnName("copyid");
            entity.Property(e => e.Bookid).HasColumnName("bookid");
            entity.Property(e => e.Isavailable)
                .HasDefaultValue(true)
                .HasColumnName("isavailable");
            entity.Property(e => e.Isdamaged)
                .HasDefaultValue(false)
                .HasColumnName("isdamaged");
            entity.HasOne(d => d.Book).WithMany(p => p.Bookcopies)
                .HasForeignKey(d => d.Bookid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_book");
        });

        modelBuilder.Entity<Borrowing>(entity =>
        {
            entity.HasKey(e => e.Borrowingid).HasName("borrowing_pkey");
            entity.ToTable("borrowing");

            entity.Property(e => e.Borrowingid).HasColumnName("borrowingid");
            
            entity.Property(e => e.Borrowdate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("borrowdate");

            entity.Property(e => e.Copyid).HasColumnName("copyid");

            entity.Property(e => e.Duedate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("duedate");

            entity.Property(e => e.Fineamount)
                .HasPrecision(10, 2)
                .HasDefaultValue(0m)
                .HasColumnName("fineamount");

            entity.Property(e => e.Isreturned)
                .HasDefaultValue(false)
                .HasColumnName("isreturned");

            entity.Property(e => e.Memberid).HasColumnName("memberid");

            entity.Property(e => e.Returndate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("returndate");

            entity.HasOne(d => d.Copy).WithMany(p => p.Borrowings)
                .HasForeignKey(d => d.Copyid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_copy");

            entity.HasOne(d => d.Member).WithMany(p => p.Borrowings)
                .HasForeignKey(d => d.Memberid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_member");
        });

        modelBuilder.Entity<Finepayment>(entity =>
        {
            entity.HasKey(e => e.Paymentid).HasName("finepayment_pkey");

            entity.ToTable("finepayment");

            entity.Property(e => e.Paymentid).HasColumnName("paymentid");

            entity.Property(e => e.Amountpaid)
                .HasPrecision(10, 2)
                .HasColumnName("amountpaid");

            entity.Property(e => e.Borrowingid).HasColumnName("borrowingid");

            entity.Property(e => e.Paiddate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("paiddate");

            entity.HasOne(d => d.Borrowing).WithMany(p => p.Finepayments)
                .HasForeignKey(d => d.Borrowingid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_borrowing");
        });

        modelBuilder.Entity<Member>(entity =>
        {
            entity.HasKey(e => e.Memberid).HasName("member_pkey");

            entity.ToTable("member");

            entity.HasIndex(e => e.Email, "member_email_key").IsUnique();

            entity.HasIndex(e => e.Phone, "member_phone_key").IsUnique();

            entity.Property(e => e.Memberid).HasColumnName("memberid");

            entity.Property(e => e.Address).HasColumnName("address");

            entity.Property(e => e.Createdat)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdat");

            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");

            entity.Property(e => e.Isactive)
                .HasDefaultValue(true)
                .HasColumnName("isactive");

            entity.Property(e => e.Membershiptypeid).HasColumnName("membershiptypeid");

            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");

            entity.Property(e => e.Phone)
                .HasMaxLength(15)
                .HasColumnName("phone");

            entity.HasOne(d => d.Membershiptype).WithMany(p => p.Members)
                .HasForeignKey(d => d.Membershiptypeid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_membership");
        });

        modelBuilder.Entity<Membershiptype>(entity =>
        {
            entity.HasKey(e => e.Membershiptypeid).HasName("membershiptype_pkey");

            entity.ToTable("membershiptype");

            entity.HasIndex(e => e.Typename, "membershiptype_typename_key").IsUnique();

            entity.Property(e => e.Membershiptypeid).HasColumnName("membershiptypeid");

            entity.Property(e => e.Maxborrowdays).HasColumnName("maxborrowdays");

            entity.Property(e => e.Maxborrowlimit).HasColumnName("maxborrowlimit");
            
            entity.Property(e => e.Typename)
                .HasMaxLength(50)
                .HasColumnName("typename");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
