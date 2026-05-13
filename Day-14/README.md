# Entity Framework Core Fluent API

## Topics Covered

* Entity Framework Core
* PostgreSQL Connection
* DbContext
* DbSet
* Fluent API
* One-to-Many Relationship
* Foreign Key
* Navigation Property
* Eager Loading
* Seed Data
* Migrations

---

# Entity Framework Core

Entity Framework Core (EF Core) is an ORM that maps C# classes to database tables.

```text
C# Classes -> Database Tables
```

---

# Packages Installed

```bash
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --prerelease

dotnet add package Microsoft.EntityFrameworkCore.Design --prerelease
```

---

# EF Tool Installation

```bash
dotnet tool install --global dotnet-ef --prerelease
```

---

# DbContext

`DbContext` acts as the bridge between the application and the database.

```csharp
public class BankingContext : DbContext
{
}
```

---

# Database Connection

```csharp
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder.UseNpgsql(
        "Host=localhost;Port=5432;Database=bankingdb;Username=postgres;Password=password"
    );
}
```

---

# DbSet

`DbSet` represents database tables.

```csharp
public DbSet<Customer> customers { get; set; }

public DbSet<Account> accounts { get; set; }
```

---

# One-to-Many Relationship

```text
One Customer -> Many Accounts
```

---

# Customer Model

```csharp
public ICollection<Account>? Accounts { get; set; }
```

Represents:

* One customer can have many accounts.

---

# Account Model

```csharp
public int CustomerId { get; set; }

public Customer? Customer { get; set; }
```

* `CustomerId` -> Foreign Key
* `Customer` -> Navigation Property

---

# Fluent API

Fluent API is used inside `OnModelCreating()` to configure models and relationships.

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
}
```

---

# Primary Key Configuration

```csharp
c.HasKey(c => c.Id);
```

---

# Relationship Configuration

```csharp
a.HasOne(a => a.Customer)
 .WithMany(c => c.Accounts)
 .HasForeignKey(a => a.CustomerId);
```

Explanation:

* `HasOne()` -> Account has one customer
* `WithMany()` -> Customer has many accounts
* `HasForeignKey()` -> Defines foreign key

---

# HasConstraintName

```csharp
.HasConstraintName("FK_Account_Customer")
```

Assigns a custom name to the foreign key constraint.

---

# HasColumnType

```csharp
.HasColumnType("timestamp without time zone")
```

Defines the exact PostgreSQL column datatype.

---

# Delete Behavior

```csharp
.OnDelete(DeleteBehavior.Restrict)
```

Prevents deleting a customer if related accounts exist.

---

# Seed Data

```csharp
c.HasData(new Customer()
{
    Id = 101,
    Name = "Ramu"
});
```

Inserts default data during migration.

---

# Eager Loading

Used to load related data together.

```csharp
var customers = context.customers
                       .Include(c => c.Accounts)
                       .ToList();
```

---

# Migration Commands

Create Migration:

```bash
dotnet ef migrations add First
```

Apply Migration:

```bash
dotnet ef database update
```

---

# Key Learnings

* EF Core maps classes to tables
* DbContext manages database interaction
* DbSet represents tables
* Fluent API configures relationships
* Navigation properties enable eager loading
* Migrations create/update database schema
* Seed data inserts default records
