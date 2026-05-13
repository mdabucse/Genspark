# Notification Management System using EF Core

## Project Overview

This project is a Notification Management System developed using:

- C#
- .NET 10
- PostgreSQL
- Entity Framework Core
- Code First Approach
- 3-Tier Architecture

The project was initially developed using ADO.NET and later migrated to Entity Framework Core.

---

# Architecture

The project follows 3-Tier Architecture.

```text
NotificationAppFE          -> Frontend / Presentation Layer
NotificationAppBLLibrary   -> Business Logic Layer
NotificationAppDALLibrary  -> Data Access Layer
NotificationAppModelLibrary -> Models / Entities
```

---

# Initial ADO.NET Approach

Initially the application used:

- NpgsqlConnection
- NpgsqlCommand
- SQL Queries
- ExecuteReader()
- ExecuteNonQuery()
- DataTable
- Manual Object Mapping

Example:

```csharp
string query = "SELECT * FROM users";
NpgsqlCommand command = new NpgsqlCommand(query, connection);
```

Problems with ADO.NET approach:

- Large amount of boilerplate code
- Manual SQL query writing
- Manual mapping of rows to objects
- Difficult relationship handling
- Hard to maintain and scale

---

# Migration from ADO.NET to EF Core

The application was migrated to Entity Framework Core using the Code First Approach.

---

# Steps Involved in Migration

## 1. Install EF Core Packages

Inside DAL Project:

```bash
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

Install EF Tool:

```bash
dotnet tool install --global dotnet-ef
```

---

# 2. Create Models

Created entity models:

- UserDetails
- Account
- Notification

Example:

```csharp
public class Account
{
    public string AccountNumber { get; set; }

    public decimal Balance { get; set; }

    public int UserDetailsId { get; set; }

    public UserDetails? User { get; set; }
}
```

---

# 3. Design Relationships

## One User -> Many Accounts

```text
UserDetails
    |
    |----< Accounts
```

## One Account -> Many Notifications

```text
Account
    |
    |----< Notifications
```

---

# 4. Add Navigation Properties

Navigation properties were added for relationship handling.

Example:

```csharp
public ICollection<Account>? Accounts { get; set; }
```

---

# 5. Create AppDbContext

Created `AppDbContext` inheriting from `DbContext`.

Responsibilities:

- Configure database connection
- Configure tables
- Configure relationships
- Configure Fluent API

Example:

```csharp
public class AppDbContext : DbContext
{
    public DbSet<UserDetails> Users { get; set; }

    public DbSet<Account> Accounts { get; set; }

    public DbSet<Notification> Notifications { get; set; }
}
```

---

# 6. Configure Relationships using Fluent API

Relationships were configured inside:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
```

Example:

```csharp
modelBuilder.Entity<Account>()
    .HasOne(a => a.User)
    .WithMany(u => u.Accounts)
    .HasForeignKey(a => a.UserDetailsId);
```

---

# 7. Replace ADO.NET with EF Core

Old ADO.NET code:

```csharp
NpgsqlCommand command = new NpgsqlCommand(query, connection);
command.ExecuteNonQuery();
```

Replaced with:

```csharp
_context.Accounts.Add(account);
_context.SaveChanges();
```

Benefits:

- Automatic SQL generation
- Change tracking
- Easier CRUD operations
- Better maintainability

---

# 8. Implement Repository Pattern

Repositories were updated to use EF Core.

Example:

```csharp
public Account Create(Account value)
{
    _context.Accounts.Add(value);

    _context.SaveChanges();

    return value;
}
```

---

# 9. Use Eager Loading

Implemented Eager Loading using:

```csharp
.Include()
```

Example:

```csharp
_context.Accounts
    .Include(a => a.User)
    .FirstOrDefault();
```

Purpose:

- Load related entities together
- Reduce multiple database calls

---

# 10. Create Migration

Generate migration:

```bash
dotnet ef migrations add InitialCreate
```

Apply migration:

```bash
dotnet ef database update
```

This automatically created:

- Database
- Tables
- Relationships
- Foreign Keys

---

# Features Implemented

- Create Account
- View Account
- Send Notifications
- View Notifications
- Update Account
- Delete Account

---

# EF Core Concepts Learned

## DbContext

Acts as bridge between application and database.

---

## DbSet

Represents database tables.

Example:

```csharp
public DbSet<Account> Accounts { get; set; }
```

---

## Fluent API

Used to configure:

- Keys
- Relationships
- Constraints
- Column Types

---

## Navigation Properties

Used for relationship navigation.

Example:

```csharp
public UserDetails? User { get; set; }
```

---

## Eager Loading

Loads related data immediately.

Example:

```csharp
.Include(a => a.User)
```

---

## Code First Approach

Database schema generated from C# models.

---

# Advantages of EF Core over ADO.NET

| ADO.NET | EF Core |
|---|---|
| Manual SQL | Automatic SQL |
| Manual Mapping | Automatic Mapping |
| More Boilerplate | Cleaner Code |
| Hard Relationship Handling | Easy Relationship Handling |
| Low Maintainability | High Maintainability |

---

# Technologies Used

- C#
- .NET 10
- PostgreSQL
- Entity Framework Core
- Npgsql
- EF Core Migrations

---

# Final Outcome

Successfully migrated the Notification Management System from ADO.NET to Entity Framework Core using the Code First Approach and Fluent API.