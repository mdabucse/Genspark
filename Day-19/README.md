# Concepts Learned from ASP.NET Core Web API 
# 1. ASP.NET Core Web API

## Topics Learned

- What is Web API
- RESTful API architecture
- API endpoints
- HTTP methods
- API routing
- Controller creation
- API response handling
- Swagger integration
- OpenAPI concepts

## HTTP Methods Learned

| Method | Purpose |
|---|---|
| GET | Retrieve data |
| POST | Create data |
| PUT | Update data |
| DELETE | Remove data |

---

# 2. REST API Concepts

## REST Principles

- Stateless communication
- Resource-based APIs
- Standard HTTP methods
- JSON request and response handling

## API Endpoints Learned

```http
GET /api/books

GET /api/books/1

POST /api/books

PUT /api/books/1

DELETE /api/books/1
```

---

# 3. Controllers in ASP.NET Core

## Concepts Learned

- ControllerBase
- APIController attribute
- Route attribute
- HTTP attributes
- Action methods
- ActionResult
- IActionResult

## Attributes Learned

```csharp
[ApiController]

[Route("api/[controller]")]

[HttpGet]

[HttpPost]

[HttpPut]

[HttpDelete]
```

---

# 4. Entity Framework Core

## Concepts Learned

- ORM (Object Relational Mapper)
- DbContext
- DbSet
- Entity classes
- Database mapping
- Change tracking
- Database migrations
- CRUD operations
- SQL generation

## DbContext Learned

```csharp
public class LibraryDbContext : DbContext
{
    public DbSet<Book> Books { get; set; }
}
```

---

# 5. Database Concepts

## PostgreSQL Concepts Learned

- Database creation
- Table creation
- SQL queries
- PostgreSQL connection
- PostgreSQL case sensitivity
- Sequences
- Migration tables

## PostgreSQL Commands Learned

```sql
\c Genspark

\d

SELECT * FROM "Books";
```

---

# 6. Migrations

## Concepts Learned

- Database schema generation
- Initial migration
- Updating database
- Migration history

## Commands Learned

```bash
dotnet ef migrations add InitialCreate

dotnet ef database update
```

---

# 7. Dependency Injection (DI)

## Concepts Learned

- What is Dependency Injection
- Constructor Injection
- Service registration
- Service lifetimes
- Loose coupling

## Registration Learned

```csharp
builder.Services.AddScoped<IBookService, BookService>();
```

## Constructor Injection

```csharp
public BookService(IBookRepository repository)
{
    _repository = repository;
}
```

---

# 8. Dependency Inversion Principle (DIP)

## Concepts Learned

- Depend on abstractions
- Interfaces over concrete classes
- Loose coupling
- High-level modules
- Low-level modules

## Example

```csharp
public interface IBookRepository
{
}
```

```csharp
public class BookRepository : IBookRepository
{
}
```

---

# 9. SOLID Principles

## S — Single Responsibility Principle

A class should have only one responsibility.

### Example

- Repository handles database operations
- Service handles business logic
- Controller handles API requests

---

## O — Open Closed Principle

Software should be open for extension but closed for modification.

---

## L — Liskov Substitution Principle

Child classes should properly replace parent classes.

### Topics Learned

- Proper inheritance
- Polymorphism
- Behavioral consistency

---

## I — Interface Segregation Principle

Classes should not depend on methods they don't use.

---

## D — Dependency Inversion Principle

Depend on abstractions instead of implementations.

---

# 10. Repository Pattern

## Concepts Learned

- Data abstraction
- Database access layer
- Separation of concerns
- Interface-based repositories

## Structure Learned

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
DbContext
```

---

# 11. Service Layer

## Concepts Learned

- Business logic handling
- Validation logic
- Service abstraction
- Communication between controller and repository

---

# 12. DTO (Data Transfer Object)

## Concepts Learned

- DTO purpose
- DTO mapping
- API contracts
- Secure data transfer
- Prevent over-posting

## DTO Mapping

### Model → DTO

```csharp
BookDTO dto = new BookDTO
{
    Title = book.Title
};
```

### DTO → Model

```csharp
Book book = new Book
{
    Title = dto.Title
};
```

---

# 13. Over-Posting

## Concepts Learned

- What is over-posting
- Security risks
- Preventing over-posting using DTOs

## Understanding

Without DTOs:

Users can send unwanted fields.

With DTOs:

Only allowed fields are exposed.

---

# 14. LINQ

## Concepts Learned

- Querying collections
- Filtering data
- Projection
- Searching

## LINQ Methods Learned

### Select

```csharp
.Select(x => BookToDTO(x))
```

### Where

```csharp
.Where(x => x.Title.Contains(title))
```

### Any

```csharp
.Any(x => x.BookId == id)
```

### ToListAsync

```csharp
.ToListAsync()
```

---

# 15. Async and Await

## Concepts Learned

- Asynchronous programming
- Non-blocking operations
- Task-based programming

## Methods Learned

```csharp
await _context.SaveChangesAsync();

await _context.Books.ToListAsync();

await _context.Books.FindAsync(id);
```

---

# 16. Constructor Chaining

## Concepts Learned

- this()
- base()
- Constructor reuse
- Parent constructor calling

## Example

```csharp
public Employee(string name) : this()
{
}
```

```csharp
public Employee(string name) : base(name)
{
}
```

---

# 17. OOP Concepts

## Concepts Learned

- Classes
- Objects
- Encapsulation
- Inheritance
- Polymorphism
- Abstraction
- Interfaces

---

# 18. Validation

## Data Annotation Attributes Learned

| Attribute | Purpose |
|---|---|
| `[Key]` | Primary Key |
| `[Required]` | Required field |
| `[Range]` | Numeric validation |
| `[EmailAddress]` | Email validation |

---

# 19. Swagger / OpenAPI

## Concepts Learned

- API documentation
- API testing
- Swagger UI
- OpenAPI generation

## Configuration Learned

```csharp
builder.Services.AddSwaggerGen();

app.UseSwagger();

app.UseSwaggerUI();
```

---

# 20. PostgreSQL Case Sensitivity

## Concepts Learned

PostgreSQL converts unquoted table names to lowercase.

### Correct Query

```sql
SELECT * FROM "Books";
```

### Incorrect Query

```sql
SELECT * FROM Books;
```

---

# 21. HTTP Status Codes

## Status Codes Learned

| Status Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

---

# 22. Error Handling

## Errors Solved

- Swagger package compatibility issue
- DbContext registration issue
- Namespace issue
- PostgreSQL table case issue
- DTO mapping confusion
- Dependency Injection confusion
- Swagger configuration issue

---

# 23. Layered Architecture

## Architecture Learned

```text
Controllers
    ↓
Services
    ↓
Repositories
    ↓
DbContext
    ↓
Database
```

## Benefits Learned

- Separation of concerns
- Maintainability
- Scalability
- Loose coupling
- Testability

---

# 24. Clean Architecture Basics

## Concepts Learned

- Layer separation
- Dependency flow
- Abstraction
- Independent modules

---

# 25. API Testing

## Tools Learned

- Swagger UI
- Postman
- Browser testing

---

# 26. Package Management

## NuGet Packages Learned

```bash
dotnet add package Microsoft.EntityFrameworkCore

dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL

dotnet add package Swashbuckle.AspNetCore
```

---

# 27. Program.cs Configuration

## Concepts Learned

- Service registration
- Middleware configuration
- Swagger setup
- DbContext registration

## Example

```csharp
builder.Services.AddControllers();

builder.Services.AddDbContext<LibraryDbContext>();

app.UseSwagger();

app.MapControllers();
```

---

# 28. CRUD Operations

## Operations Learned

| Operation | Description |
|---|---|
| Create | Insert new data |
| Read | Retrieve data |
| Update | Modify existing data |
| Delete | Remove data |

---

# 29. Business Rules

## Rules Implemented

- Title should not be empty
- Author should not be empty
- Available copies should be greater than or equal to 0
- Email validation
- Return 404 when entity not found

---

# 30. Real-World Backend Development Concepts

## Concepts Learned

- Enterprise API structure
- Clean coding practices
- API security basics
- Database abstraction
- Scalable backend architecture
- Professional project structure

---

# Final Learning Outcome

Through this project and discussions, the following major backend development skills were learned:

- Building enterprise-level ASP.NET Core Web APIs
- Working with PostgreSQL using Entity Framework Core
- Implementing layered architecture
- Using Repository Pattern and Service Layer
- Applying SOLID Principles
- Understanding Dependency Injection and Dependency Inversion
- Preventing over-posting using DTOs
- Creating scalable REST APIs
- Writing clean and maintainable backend code
- Using Swagger for API documentation and testing
- Understanding LINQ and asynchronous programming
- Structuring backend applications professionally
