# Library Management System - Concepts Learned

## Overview

Through the development of the Library Management System project, multiple backend development concepts, database concepts, architecture principles, debugging techniques, and enterprise application design patterns were learned and implemented.

---

# 1. C# Concepts Learned

## Classes and Objects

Learned how to create:

- Classes
- Objects
- Properties
- Constructors
- Methods

Example:

```csharp
public class Member
{
    public int MemberId { get; set; }

    public string Name { get; set; }
}
```

---

## Access Modifiers

Used:

- public
- private
- protected

Purpose:

- Data hiding
- Encapsulation
- Controlled access

---

## Nullable Types

Learned handling nullable values.

Examples:

```csharp
decimal?
DateTime?
bool?
```

---

## Collections

Used generic collections:

```csharp
List<T>
```

Used for:

- Member lists
- Book lists
- Borrowing lists

---

## Exception Handling

Implemented:

```csharp
try
catch
finally
throw
```

Purpose:

- Prevent application crashes
- Handle business validations

---

## Custom Exceptions

Created domain-specific exceptions.

Examples:

- MemberNotFoundException
- BookUnavailableException
- BorrowLimitExceededException
- AlreadyReturnedException

Purpose:

- Better business rule handling
- Cleaner service layer logic

---

# 2. Object-Oriented Programming Concepts

## Encapsulation

Data and methods grouped inside classes.

---

## Abstraction

Implemented using interfaces.

Examples:

```csharp
IMemberService
IBookRepository
```

---

## Inheritance

Used generic repository inheritance.

Example:

```csharp
GenericRepository<T>
```

---

## Polymorphism

Implemented using interface-based dependency injection.

---

# 3. Database Concepts Learned

## PostgreSQL Database

Learned:

- Database creation
- Table creation
- Relationships
- Constraints

---

## Primary Key

Used to uniquely identify records.

Example:

```sql
MemberId SERIAL PRIMARY KEY
```

---

## Foreign Key

Used to create relationships.

Example:

```sql
MembershipTypeId REFERENCES MembershipTypes
```

---

## One-to-Many Relationships

Implemented relationships such as:

- MembershipType → Members
- Category → Books
- Book → BookCopies
- Member → Borrowings

---

## Database Normalization

Structured tables properly to avoid:

- Data redundancy
- Duplicate information

---

## Stored Procedures

Learned how to create procedures.

Example:

```sql
CREATE OR REPLACE PROCEDURE add_trans(...)
```

---

# 4. Entity Framework Core Concepts

## Database First Approach

Generated entities from database schema.

Used:

```bash
dotnet ef dbcontext scaffold
```

---

## DbContext

Learned role of:

```csharp
LibraryDbContext
```

Purpose:

- Database communication
- Entity tracking
- Transactions

---

## Entity Classes

Learned generated entity structures.

Example:

```csharp
public partial class Member
```

---

## Navigation Properties

Used relationships between entities.

Example:

```csharp
public virtual ICollection<Borrowing>
```

---

## LINQ Queries

Used LINQ for querying database.

Examples:

```csharp
Where()
Any()
Count()
FirstOrDefault()
Include()
Sum()
```

---

## Eager Loading

Used:

```csharp
Include()
```

Purpose:

- Load related entities

---

# 5. Architecture Concepts Learned

## Layered Architecture

Separated application into:

- FE
- BL
- DAL
- Interfaces
- Models
- Context
- Exceptions

Purpose:

- Better maintainability
- Clear separation

---

## Separation of Concerns

Separated:

- UI logic
- Business logic
- Database logic

---

## Repository Pattern

Created repositories for data access.

Purpose:

- Centralize database operations

---

## Generic Repository Pattern

Implemented reusable CRUD operations.

Example:

```csharp
GenericRepository<T>
```

Purpose:

- Reduce duplicate code
- Reusability

---

## Dependency Injection

Implemented using:

```csharp
Microsoft.Extensions.DependencyInjection
```

Purpose:

- Loose coupling
- Better maintainability

---

## Service Layer Pattern

Business logic placed inside services.

Examples:

- MemberService
- BookService
- BorrowingService

---

# 6. Business Logic Concepts Learned

## Borrowing Rules

Implemented validations such as:

- Borrow limit check
- Duplicate borrow check
- Active membership check
- Fine limit check
- Book availability check

---

## Fine Calculation

Calculated delayed fine based on overdue days.

---

## Role-Based Flow

Created:

- Admin flow
- Customer flow

Purpose:

- Restrict feature access

---

## Report Generation

Implemented reports such as:

- Overdue books
- Available books
- Borrow history
- Most borrowed books

---

# 7. Transaction Handling

Used EF Core transactions.

Example:

```csharp
using var transaction =
    _context.Database.BeginTransaction();
```

Purpose:

- Maintain data consistency

Implemented in:

- Borrow operation
- Return operation

---

# 8. Frontend Structure Concepts

## Helper Classes

Created helper classes:

- MemberHelper
- BookHelper
- BorrowingHelper
- ReportHelper

Purpose:

- Reduce Program.cs complexity

---

## Menu-Based Flow

Created:

- MainMenu
- AdminMenu
- CustomerMenu

Purpose:

- Better console UI organization

---

# 9. Debugging and Errors Faced

## Nullable Errors

### Error

```text
Operator '??' cannot be applied
```

### Learned

Understanding nullable and non-nullable types.

---

## Decimal Conversion Errors

### Error

```text
Cannot implicitly convert type 'decimal?' to 'decimal'
```

### Learned

Type conversion and nullable handling.

---

## DateTime Nullable Errors

### Error

```text
Operator '??' cannot be applied to DateTime
```

### Learned

Difference between nullable and non-nullable DateTime.

---

## Ambiguous Reference Errors

### Error

```text
BookUnavailableException is ambiguous
```

### Learned

Namespace conflicts and proper using statements.

---

## Dependency Injection Errors

### Error

```text
Service not resolved
```

### Learned

Service registration in DI container.

---

## Scaffold Errors

### Error

```text
Unable to retrieve project metadata
```

### Learned

Correct EF scaffold command structure.

---

## Build Errors

Learned how to:

- Read compiler messages
- Fix namespace issues
- Resolve interface mismatches

---

# 10. Testing Concepts Learned

Performed testing for:

- CRUD operations
- Exception handling
- Borrowing flow
- Return flow
- Reports
- Role flow

---

# 11. Important Enterprise Concepts Learned

## Clean Code Structure

Organized files properly.

---

## Reusability

Implemented reusable repositories and helpers.

---

## Maintainability

Separated layers and responsibilities.

---

## Scalability

Architecture supports future enhancements.

---

# 12. Important Tools Learned

| Tool | Purpose |
|---|---|
| PostgreSQL | Database |
| pgAdmin | Database management |
| EF Core | ORM |
| LINQ | Querying |
| Dependency Injection | Service management |
| .NET CLI | Build and run |
| GitHub | Version control |

---

# 13. Commands Learned

## Scaffold Command

```bash
dotnet ef dbcontext scaffold
```

---

## Build Project

```bash
dotnet build
```

---

## Run Project

```bash
dotnet run
```

---

## Add Package

```bash
dotnet add package
```

---

# 14. Future Learning Areas

Possible future improvements:

- ASP.NET Core Web API
- Authentication
- JWT
- Async Programming
- Logging
- DTOs
- Validation Framework
- Unit Testing
- Docker
- Microservices

---

# 15. Conclusion

Through this project, strong foundational knowledge was gained in:

- C#
- Object-Oriented Programming
- PostgreSQL
- Entity Framework Core
- Layered Architecture
- Repository Pattern
- Dependency Injection
- Transactions
- Exception Handling
- Enterprise Backend Development

