# Self Learned Concepts  from Building ASP.NET WebAPI

# Introduction

This document summarizes all the important concepts learned while building a Mini Microservice using ASP.NET Core Web API and Entity Framework Core.

The project covered:
- REST API development
- ASP.NET Core architecture
- Dependency Injection
- Entity Framework Core
- In-Memory Database
- Service Layer architecture
- Async programming
- Routing
- CRUD operations
- Middleware
- Swagger integration

---

# 1. ASP.NET Core Web API

## What is ASP.NET Core?

ASP.NET Core is a cross-platform framework used to build:
- Web APIs
- Web Applications
- Microservices
- Cloud-based applications

---

# 2. REST API Concepts

## What is REST?

REST (Representational State Transfer) is an architectural style used to build APIs.

REST APIs use:
- HTTP methods
- URLs
- JSON data

---

# 3. HTTP Methods

| Method | Purpose |
|---|---|
| GET | Retrieve data |
| POST | Create data |
| PUT | Update complete resource |
| PATCH | Partial update |
| DELETE | Remove resource |

---

# 4. Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource Not Found |
| 500 | Internal Server Error |

---

# 5. Program.cs Architecture

## Responsibilities of Program.cs

Program.cs is the startup file of ASP.NET Core.

It is responsible for:
- Configuring services
- Configuring middleware
- Mapping routes
- Starting the application

---

# 6. WebApplication Builder

```csharp
var builder = WebApplication.CreateBuilder(args);
```

## Internally Performs

- Creates Dependency Injection container
- Configures logging
- Loads configuration
- Initializes Kestrel server
- Configures routing system

---

# 7. Dependency Injection (DI)

## What is Dependency Injection?

Dependency Injection is a design pattern where dependencies are automatically provided by the framework instead of manually creating objects.

---

# DI Container

```csharp
builder.Services
```

This acts as a service registry.

---

# Benefits of DI

- Loose coupling
- Better testing
- Better maintainability
- Cleaner architecture

---

# 8. Service Registration

```csharp
builder.Services.AddScoped<IBookService, BookServiceManager>();
```

## Meaning

- Register interface and implementation
- ASP.NET creates service automatically

---

# Service Lifetimes

| Lifetime | Meaning |
|---|---|
| Singleton | One instance for entire app |
| Scoped | One instance per request |
| Transient | New instance every time |

---

# 9. Controllers

## What is a Controller?

Controllers handle incoming HTTP requests.

Example:

```csharp
public class BooksController : ControllerBase
```

---

# Controller Responsibilities

- Handle HTTP requests
- Return HTTP responses
- Call service layer

---

# 10. ControllerBase

`ControllerBase` provides:
- Ok()
- NotFound()
- BadRequest()
- HTTP Context access

---

# 11. Routing

## Attribute Routing

```csharp
[Route("api/[controller]")]
```

ASP.NET automatically replaces:
- `[controller]`
with controller class name.

---

# Example

```csharp
BooksController
```

becomes:

```text
/api/books
```

---

# 12. HTTP Attributes

| Attribute | Purpose |
|---|---|
| [HttpGet] | GET request |
| [HttpPost] | POST request |
| [HttpPut] | PUT request |
| [HttpDelete] | DELETE request |

---

# 13. IActionResult

## What is IActionResult?

Represents HTTP response returned from controller actions.

Example:

```csharp
return Ok(book);
```

---

# Common IActionResult Methods

| Method | Status Code |
|---|---|
| Ok() | 200 |
| Created() | 201 |
| NotFound() | 404 |
| BadRequest() | 400 |

---

# 14. Model Binding

## What is Model Binding?

ASP.NET automatically converts:
- JSON request body
into
- C# objects

Example:

```json
{
  "title": "Clean Code"
}
```

becomes:

```csharp
Book book
```

---

# 15. FromBody Attribute

```csharp
[FromBody] Book book
```

Means:
- Read data from request body
- Convert JSON into object

---

# 16. CRUD Operations

## Create

```http
POST /api/books
```

Adds new resource.

---

## Read

```http
GET /api/books
```

Retrieves data.

---

## Update

```http
PUT /api/books/1
```

Updates existing resource.

---

## Delete

```http
DELETE /api/books/1
```

Deletes resource.

---

# 17. Service Layer Architecture

## Why Service Layer?

Separates:
- business logic
from
- controller logic

---

# Architecture Flow

```text
Controller
    ↓
Service Layer
    ↓
Database
```

---

# Benefits

- Cleaner architecture
- Better testing
- Reusability
- Loose coupling

---

# 18. Interfaces

## What is an Interface?

Defines method contracts without implementation.

Example:

```csharp
public interface IBookService
```

---

# Benefits

- Abstraction
- Loose coupling
- Easier mocking/testing

---

# 19. Entity Framework Core (EF Core)

## What is EF Core?

Entity Framework Core is an ORM (Object Relational Mapper).

It maps:
- C# objects
to
- Database tables

---

# ORM Concept

```text
C# Objects
     ↕
Database Tables
```

---

# 20. DbContext

## What is DbContext?

Represents database session.

Responsible for:
- querying data
- tracking entities
- saving changes

---

# Example

```csharp
public class AppDbContext : DbContext
```

---

# 21. DbSet

```csharp
public DbSet<Book> Books { get; set; }
```

Represents database table.

---

# 22. In-Memory Database

## What is In-Memory Database?

Temporary database stored in RAM.

---

# Configuration

```csharp
options.UseInMemoryDatabase("BookDb")
```

---

# Characteristics

- No actual SQL database
- Data stored in memory
- Data removed after app restart

---

# 23. Async and Await

## Why Async?

Database operations are slow.

Async programming:
- prevents thread blocking
- improves scalability

---

# Example

```csharp
await _context.SaveChangesAsync();
```

---

# Task<T>

Represents future result.

Example:

```csharp
Task<List<Book>>
```

---

# 24. Middleware

## What is Middleware?

Software component inside request pipeline.

---

# Request Flow

```text
Request
   ↓
Middleware
   ↓
Controller
   ↓
Response
```

---

# Example Middleware

```csharp
app.UseHttpsRedirection();
```

---

# 25. HTTPS Redirection

Automatically redirects:
- HTTP
to
- HTTPS

---

# 26. Endpoint Mapping

```csharp
app.MapControllers();
```

Maps controller routes into routing system.

---

# 27. Swagger

## What is Swagger?

Swagger provides:
- API documentation
- API testing UI

---

# Swagger Configuration

```csharp
builder.Services.AddSwaggerGen();
```

---

# Swagger UI

```text
https://localhost:xxxx/swagger
```

---

# 28. JSON Serialization

ASP.NET automatically converts:
- C# objects ↔ JSON

---

# Example

```csharp
Book
```

becomes:

```json
{
  "id": 1,
  "title": "Clean Code"
}
```

---

# 29. Internal Request Lifecycle

```text
Client Request
      ↓
Kestrel Server
      ↓
Middleware Pipeline
      ↓
Routing System
      ↓
Controller
      ↓
Service Layer
      ↓
DbContext
      ↓
Database
      ↓
Response Returned
```

---

# 30. Kestrel Server

## What is Kestrel?

Built-in ASP.NET Core web server.

Responsible for:
- listening to HTTP requests
- processing requests
- returning responses

---

# 31. Separation of Concerns

## Meaning

Each layer should have single responsibility.

---

# Example

| Layer | Responsibility |
|---|---|
| Controller | Handle HTTP |
| Service | Business logic |
| DbContext | Database access |

---

# 32. Constructor Injection

```csharp
public BooksController(IBookService bookService)
```

ASP.NET automatically injects dependencies into constructor.

---

# 33. LINQ

## What is LINQ?

Language Integrated Query used for querying collections and databases.

Example:

```csharp
_context.Books.ToListAsync()
```

---

# 34. Entity Tracking

EF Core tracks object changes internally.

Entity States:
- Added
- Modified
- Deleted
- Unchanged

---

# 35. SaveChangesAsync

```csharp
await _context.SaveChangesAsync();
```

Commits tracked changes into database.

---

# 36. Repository Pattern (Conceptual)

Separates:
- data access logic
from
- service logic

Architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

---

# 37. Microservice Concepts Learned

- Independent API service
- REST communication
- Layered architecture
- Service abstraction
- Lightweight APIs

---

# 38. Common Errors Learned

| Error | Cause |
|---|---|
| AddSwaggerGen not found | Missing Swagger package |
| IActionResult error | Missing ControllerBase |
| Namespace used like type | Namespace and class naming conflict |
| Inconsistent accessibility | Model class not public |

---

# 39. Best Practices Learned

- Use service layer
- Use dependency injection
- Use async database operations
- Separate concerns
- Use interfaces
- Use controller-based routing
- Use proper HTTP status codes

---

# 40. Overall Architecture Built

```text
Client
   ↓
Controller
   ↓
Service Layer
   ↓
Entity Framework Core
   ↓
In-Memory Database
```

---

# Conclusion

This project provided practical understanding of:
- ASP.NET Core Web API
- REST architecture
- Dependency Injection
- Entity Framework Core
- Async programming
- Middleware pipeline
- Service layer architecture
- In-Memory database operations

The project serves as a strong foundation for building scalable backend applications and microservices.