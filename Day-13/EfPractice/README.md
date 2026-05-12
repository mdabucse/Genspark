# Practice (Entity Framework Core)

## Project Overview

This project demonstrates how to build a simple Employee Management System using:

- C#
- Entity Framework Core
- PostgreSQL
- Code First Approach
- Layered Architecture

The project performs CRUD Operations:

- Insert Employee
- Update Employee
- Delete Employee

---

# Technologies Used

| Technology | Purpose |
|---|---|
| C# | Programming Language |
| Entity Framework Core | ORM Framework |
| PostgreSQL | Database |
| .NET | Runtime |
| EF Core Migrations | Database Schema Management |

---

# Project Architecture

```text
EfPractice
│
├── EfPractice.Model
│       └── Entity Classes
│
├── EfPractice.DAL
│       └── Database Access Layer
│
├── EfPractice.BL
│       └── Business Logic Layer
│
└── EfPractice.FE
        └── Front End / Console UI
```

---

# Concepts Learned

- Entity Framework Core
- DbContext
- DbSet
- Migrations
- Code First Approach
- CRUD Operations
- Entity Tracking
- Entity States
- PostgreSQL Integration
- Layered Architecture

---

# Step 1 - Create Solution

```bash
dotnet new sln -n EfPractice
```

---

# Step 2 - Create Projects

## Create Model Project

```bash
dotnet new classlib -n EfPractice.Model
```

## Create DAL Project

```bash
dotnet new classlib -n EfPractice.DAL
```

## Create BL Project

```bash
dotnet new classlib -n EfPractice.BL
```

## Create FE Project

```bash
dotnet new console -n EfPractice.FE
```

---

# Step 3 - Add Projects to Solution

```bash
dotnet sln add EfPractice.Model/EfPractice.Model.csproj

dotnet sln add EfPractice.DAL/EfPractice.DAL.csproj

dotnet sln add EfPractice.BL/EfPractice.BL.csproj

dotnet sln add EfPractice.FE/EfPractice.FE.csproj
```

---

# Step 4 - Add Project References

## DAL References Model

```bash
dotnet add EfPractice.DAL reference EfPractice.Model
```

## BL References DAL and Model

```bash
dotnet add EfPractice.BL reference EfPractice.DAL

dotnet add EfPractice.BL reference EfPractice.Model
```

## FE References BL, DAL and Model

```bash
dotnet add EfPractice.FE reference EfPractice.BL

dotnet add EfPractice.FE reference EfPractice.DAL

dotnet add EfPractice.FE reference EfPractice.Model
```

---

# Step 5 - Install Required Packages

Move inside DAL project:

```bash
cd EfPractice.DAL
```

Install Packages:

```bash
dotnet add package Microsoft.EntityFrameworkCore --version 10.0.7

dotnet add package Microsoft.EntityFrameworkCore.Design --version 10.0.7

dotnet add package Microsoft.EntityFrameworkCore.Tools --version 10.0.7

dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 10.0.7
```

Install EF Tool:

```bash
dotnet tool install --global dotnet-ef --version 8.0.0
```

---

# Step 6 - Create Employee Model

File: `Employee.cs`

```csharp
namespace EfPractice.Model
{
    public class Employee
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;
    }
}
```

---

# Step 7 - Create DbContext

File: `EmployeeContext.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using EfPractice.Model;

namespace EfPractice.DAL
{
    public class EmployeeContext : DbContext
    {
        public DbSet<Employee> Employees { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(
                "Host=localhost;Port=5432;Database=EmployeeDb;Username=postgres;Password=password"
            );
        }
    }
}
```

---

# Step 8 - Create Migration

Move inside DAL folder:

```bash
cd EfPractice.DAL
```

Create Migration:

```bash
dotnet ef migrations add First
```

Apply Migration:

```bash
dotnet ef database update
```

---

# Step 9 - Create Repository

File: `EmployeeRepo.cs`

```csharp
using EfPractice.Model;

namespace EfPractice.DAL
{
    public class EmployeeRepo
    {
        EmployeeContext employee;

        public EmployeeRepo()
        {
            employee = new EmployeeContext();
        }

        public void InsertEmployee(Employee emp)
        {
            employee.Add(emp);

            employee.SaveChanges();

            Console.WriteLine("Value Inserted Successfully");
        }

        public void UpdateEmployee(Employee emp)
        {
            employee.Update(emp);

            employee.SaveChanges();

            Console.WriteLine("Value Updated Successfully");
        }

        public void DeleteEmployee(Employee emp)
        {
            employee.Remove(emp);

            employee.SaveChanges();

            Console.WriteLine("Value Removed Successfully");
        }
    }
}
```

---

# Step 10 - Create Input Class

File: `InputsFromUser.cs`

```csharp
using EfPractice.Model;

namespace EfPractice.BL
{
    public class InputsFromUser
    {
        public Employee GetInputs()
        {
            Employee emp = new Employee();

            Console.WriteLine("Enter Employee Name:");
            emp.Name = Console.ReadLine() ?? "";

            Console.WriteLine("Enter Employee Email:");
            emp.Email = Console.ReadLine() ?? "";

            Console.WriteLine("Enter Employee Phone:");
            emp.Phone = Console.ReadLine() ?? "";

            return emp;
        }

        public Employee GetUpdatedEmployee()
        {
            Employee emp = new Employee();

            Console.WriteLine("Enter Employee Id:");
            emp.Id = Convert.ToInt32(Console.ReadLine());

            Console.WriteLine("Enter Employee Name:");
            emp.Name = Console.ReadLine() ?? "";

            Console.WriteLine("Enter Employee Email:");
            emp.Email = Console.ReadLine() ?? "";

            Console.WriteLine("Enter Employee Phone:");
            emp.Phone = Console.ReadLine() ?? "";

            return emp;
        }
    }
}
```

---

# Step 11 - Create Front End Program

File: `Program.cs`

```csharp
using EfPractice.DAL;
using EfPractice.BL;
using EfPractice.Model;

namespace EfPractice.FE
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Employee emp;
            EmployeeRepo repo;
            InputsFromUser First;

            Console.WriteLine("Choose an Operation");
            Console.WriteLine("1. Insert Employee");
            Console.WriteLine("2. Update Employee");
            Console.WriteLine("3. Delete Employee");

            Console.WriteLine("Enter Your Choice:");

            int n = Convert.ToInt32(Console.ReadLine());

            switch (n)
            {
                case 1:

                    emp = new Employee();

                    repo = new EmployeeRepo();

                    First = new InputsFromUser();

                    Console.WriteLine("Enter Employee Details");

                    emp = First.GetInputs();

                    repo.InsertEmployee(emp);

                    break;

                case 2:

                    emp = new Employee();

                    repo = new EmployeeRepo();

                    First = new InputsFromUser();

                    Console.WriteLine("Enter Updated Employee Details");

                    emp = First.GetUpdatedEmployee();

                    repo.UpdateEmployee(emp);

                    break;

                case 3:

                    emp = new Employee();

                    repo = new EmployeeRepo();

                    Console.WriteLine("Enter Employee Id To Delete:");

                    emp.Id = Convert.ToInt32(Console.ReadLine());

                    repo.DeleteEmployee(emp);

                    break;

                default:

                    Console.WriteLine("Invalid Choice");

                    break;
            }
        }
    }
}
```

---

# CRUD Operations Performed

## Insert Employee

Uses:

```csharp
Add()
SaveChanges()
```

SQL Generated:

```sql
INSERT INTO Employees
```

---

## Update Employee

Uses:

```csharp
Update()
SaveChanges()
```

SQL Generated:

```sql
UPDATE Employees
```

---

## Delete Employee

Uses:

```csharp
Remove()
SaveChanges()
```

SQL Generated:

```sql
DELETE FROM Employees
```

---

# Entity States Learned

| State | Meaning |
|---|---|
| Added | New Entity |
| Modified | Updated Entity |
| Deleted | Entity Marked for Delete |
| Unchanged | Synced With Database |
| Detached | Not Tracked |

---

# Important EF Core Concepts

## DbContext

Acts as bridge between:
- C#
- PostgreSQL

Responsible for:
- Tracking Entities
- Executing SQL
- Managing Database Connection

---

## DbSet

Represents:
- Database Table
- Entity Collection

Example:

```csharp
DbSet<Employee> Employees
```

---

## SaveChanges()

Responsible for:
- Executing SQL Queries
- Saving tracked changes into database

---

## Migrations

Used to:
- Create Database Schema
- Update Database Structure
- Synchronize Models and Database

Commands:

```bash
dotnet ef migrations add First

dotnet ef database update
```

---

# Final Outcome

Successfully implemented:

- Layered Architecture
- PostgreSQL Integration
- Entity Framework Core
- CRUD Operations
- Code First Approach
- EF Core Migrations
- Entity Tracking
- Database Synchronization