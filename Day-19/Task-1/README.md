# Library Management System Web API

## Project Overview

The Library Management System Web API is an ASP.NET Core Web API application developed using Entity Framework Core and PostgreSQL. The project follows a layered architecture with Repository Pattern and Service Layer implementation.

This application provides RESTful APIs for managing books and members in a library system.

---

# Project Architecture

The project follows a clean layered architecture:

```text
Client
   ↓
Controllers
   ↓
Service Layer
   ↓
Repository Layer
   ↓
Entity Framework Core
   ↓
PostgreSQL Database
```

---

# Project Structure

```text
LibraryManagement.API
│
├── Controllers
│   ├── BooksController.cs
│   └── MembersController.cs
│
├── Models
│   ├── Book.cs
│   └── Member.cs
│
├── Data
│   └── LibraryDbContext.cs
│
├── Repository
│   ├── IBookRepository.cs
│   ├── BookRepository.cs
│   ├── IMemberRepository.cs
│   └── MemberRepository.cs
│
├── Services
│   ├── IBookService.cs
│   ├── BookService.cs
│   ├── IMemberService.cs
│   └── MemberService.cs
│
├── DTOs
│   ├── BookDTO.cs
│   └── MemberDTO.cs
│
├── appsettings.json
├── Program.cs
└── README.md
```

---

# Features

## Book Management

- Add Book
- Get All Books
- Get Book By Id
- Search Books By Title

## Member Management

- Add Member
- Get All Members
- Get Member By Id

---

# Business Rules

## Book Validations

- Book title should not be empty
- Author name should not be empty
- ISBN should not be empty
- Available copies should be greater than or equal to 0

## Member Validations

- Full name should not be empty
- Email should not be empty
- Phone number should not be empty

## API Rules

- Return 404 Not Found when book or member is unavailable
- Use DTOs to prevent over-posting
- All APIs return proper HTTP status codes

---

# Database Configuration

## PostgreSQL Connection String

Update `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=Genspark;Username=postgres;Password=your_password"
  }
}
```

---

# Entity Models

## Book Model

```csharp
public class Book
{
    public int BookId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Author { get; set; } = string.Empty;

    public string ISBN { get; set; } = string.Empty;

    public int PublishedYear { get; set; }

    public int AvailableCopies { get; set; }
}
```

## Member Model

```csharp
public class Member
{
    public int MemberId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public DateTime MembershipDate { get; set; }
}
```

---

# API Endpoints

## Book APIs

### Add Book

```http
POST /api/books
```

### Sample Request

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "publishedYear": 2008,
  "availableCopies": 5
}
```

### Sample Response

```json
{
  "message": "Book added successfully"
}
```

---

### Get All Books

```http
GET /api/books
```

---

### Get Book By Id

```http
GET /api/books/1
```

---

### Search Book By Title

```http
GET /api/books/search?title=clean
```

---

## Member APIs

### Add Member

```http
POST /api/members
```

### Sample Request

```json
{
  "fullName": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "phoneNumber": "9876543210",
  "membershipDate": "2026-05-20"
}
```

### Sample Response

```json
{
  "message": "Member added successfully"
}
```

---

### Get All Members

```http
GET /api/members
```

---

### Get Member By Id

```http
GET /api/members/1
```

---

# Dependency Injection

Dependencies are registered in `Program.cs`.

```csharp
builder.Services.AddScoped<IBookRepository, BookRepository>();

builder.Services.AddScoped<IMemberRepository, MemberRepository>();

builder.Services.AddScoped<IBookService, BookService>();

builder.Services.AddScoped<IMemberService, MemberService>();
```

---

# Entity Framework Core Setup

## DbContext Registration

```csharp
builder.Services.AddDbContext<LibraryDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));
```

---

# Swagger Configuration

```csharp
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();
```

```csharp
app.UseSwagger();

app.UseSwaggerUI();
```

---

# Migrations

## Create Migration

```bash
dotnet ef migrations add InitialCreate
```

## Update Database

```bash
dotnet ef database update
```

---

# Running the Project

## Restore Packages

```bash
dotnet restore
```

## Build Project

```bash
dotnet build
```

## Run Application

```bash
dotnet run
```

---

# Swagger URL

```text
https://localhost:5001/swagger
```

or

```text
http://localhost:5000/swagger
```

---

# Concepts Implemented

- REST API
- Layered Architecture
- Repository Pattern
- Service Layer
- Dependency Injection
- Dependency Inversion Principle
- SOLID Principles
- Entity Framework Core
- PostgreSQL Integration
- DTO Mapping
- LINQ Queries
- Swagger Documentation
- CRUD Operations
- Async/Await
- Model Validation

---

# HTTP Status Codes Used

| Status Code | Description |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

---

# DTO Mapping

The application uses DTOs to prevent over-posting attacks.

Example:

```csharp
private static BookDTO BookToDTO(Book book) =>
    new BookDTO
    {
        BookId = book.BookId,
        Title = book.Title,
        Author = book.Author,
        ISBN = book.ISBN,
        PublishedYear = book.PublishedYear,
        AvailableCopies = book.AvailableCopies
    };
```

---

# Repository Pattern

Repository Layer abstracts database operations from business logic.

Example:

```csharp
public interface IBookRepository
{
    Task<IEnumerable<Book>> GetAllBooksAsync();

    Task<Book?> GetBookByIdAsync(int id);

    Task AddBookAsync(Book book);
}
```

---

# Service Layer

Service Layer contains business logic and validation.

Example:

```csharp
public interface IBookService
{
    Task<IEnumerable<BookDTO>> GetAllBooksAsync();

    Task<BookDTO?> GetBookByIdAsync(int id);

    Task AddBookAsync(BookDTO bookDTO);
}
```

---

# PostgreSQL Commands

## Connect Database

```bash
psql -U postgres
```

## Select Database

```sql
\c Genspark
```

## List Tables

```sql
\d
```

## View Table Data

```sql
SELECT * FROM "Books";

SELECT * FROM "Members";
```

---
# Author

Mohamed Abubakkar