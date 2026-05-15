# Library Management System

## Overview

Library Management System is a layered console-based application developed using:

- C#
- .NET
- Entity Framework Core
- PostgreSQL

The project follows enterprise-level backend architecture principles such as:

- Layered Architecture
- Repository Pattern
- Generic Repository
- Dependency Injection
- Separation of Concerns
- Custom Exception Handling

---

# Project Architecture

```text
LMS Solution
│
├── LMS.FE
├── LMS.BL
├── LMS.DAL
├── LMS.Interfaces
├── LMS.Models
├── LMS.Context
└── LMS.Exceptions
```

---

# Layers Description

## LMS.FE

Frontend layer responsible for:

- Console UI
- Menus
- User interaction
- Helper classes
- Flow handling

### Contains

- Program.cs
- Menus
- Helpers
- Configurations

---

## LMS.BL

Business Logic Layer.

Responsible for:

- Business validations
- Rules implementation
- Transaction handling
- Exception throwing

### Services

- MemberService
- BookService
- BorrowingService
- ReturnService
- FineService
- ReportService

---

## LMS.DAL

Data Access Layer.

Responsible for:

- Database communication
- LINQ queries
- Repository implementations

### Repositories

- GenericRepository
- MemberRepository
- BookRepository
- BorrowingRepository
- FineRepository
- ReportRepository

---

## LMS.Interfaces

Contains abstraction interfaces.

### Interfaces

- Service Interfaces
- Repository Interfaces
- Generic Repository Interface

---

## LMS.Models

Contains Entity Framework entities and enums.

### Entities

- Member
- Book
- BookCopy
- Borrowing
- MembershipType
- Category

---

## LMS.Context

Contains:

- DbContext
- EF Core configurations

### Context

- LibraryDbContext

---

## LMS.Exceptions

Contains custom exception classes.

### Exception Categories

- Member Exceptions
- Book Exceptions
- Borrowing Exceptions
- Fine Exceptions

---

# Features Implemented

## Member Management

- Add Member
- View Members
- Search Member
- Deactivate Member

---

## Book Management

- Add Book
- View Books
- Search Books
- Add Book Copies

---

## Borrowing Management

- Borrow Book
- Return Book
- Fine Calculation
- Due Date Management

---

## Reports

- Overdue Books
- Members With Pending Fine
- Most Borrowed Books
- Available Books
- Borrowing History

---

# Architecture Concepts Implemented

## Layered Architecture

Separated project into:

- FE
- BL
- DAL
- Interfaces
- Models

---

## Repository Pattern

Implemented repositories for database operations.

---

## Generic Repository

Created reusable CRUD operations using:

```csharp
GenericRepository<T>
```

---

## Dependency Injection

Configured service registration using:

```csharp
Microsoft.Extensions.DependencyInjection
```

---

## Custom Exception Handling

Implemented domain-based exceptions.

### Examples

- MemberNotFoundException
- DuplicateEmailException
- BookUnavailableException
- BorrowLimitExceededException
- AlreadyReturnedException

---

## Transactions

Used EF Core transactions for:

- Borrow Book
- Return Book

---

## Role-Based Menu Flow

Implemented two roles:

### Admin

Can:

- Manage Members
- Manage Books
- View Reports

### Customer

Can:

- Search Books
- Borrow Books
- Return Books
- View Fine
- View Borrowing History

---

# Database First Approach

Used EF Core Scaffold command.

```bash
dotnet ef dbcontext scaffold
```

Generated:

- Entities
- DbContext

from PostgreSQL database.

---

# Technologies Used

| Technology | Purpose |
|---|---|
| C# | Backend Language |
| .NET | Application Framework |
| EF Core | ORM |
| PostgreSQL | Database |
| LINQ | Querying |
| Dependency Injection | Service Management |

---

# Project Structure

```text
LMS.FE
│
├── Configurations
│   └── ServiceConfiguration.cs
│
├── Helpers
│   ├── MemberHelper.cs
│   ├── BookHelper.cs
│   ├── BorrowingHelper.cs
│   ├── ReportHelper.cs
│   └── InputHelper.cs
│
├── Menus
│   ├── MainMenu.cs
│   ├── AdminMenu.cs
│   └── CustomerMenu.cs
│
└── Program.cs
```

---

# Important Concepts Learned

- Entity Framework Core
- Database First Approach
- Generic Repository Pattern
- Dependency Injection
- LINQ
- Transactions
- Custom Exceptions
- Layered Architecture
- Separation of Concerns
- Role-Based Flow Design

---

# Recent Enhancements & Bug Fixes

## Logic Corrections
- Eager Loading Fixed: Resolved NullReferenceException by including navigation properties (like Membershiptype) when fetching members from the database.
- Fine Calculation Adjusted: Modified the logic to ensure that fines for already-returned books do not permanently block members from future borrowing.
- Book Copy Addition Fixed: Corrected the logic in AddBookCopies to create new physical copy records instead of duplicating the parent book entity.

## User Experience (UX) Enhancements
- Active Borrowings Display: Updated the ReturnBook and PayFine flows to display a tabular list of a member's active borrowings, allowing users to easily identify the correct BorrowingId.
- Input Validation & Safety: Replaced unsafe Convert methods with TryParse to handle invalid inputs gracefully and prevent infinite loops when encountering invalid or end-of-stream scenarios.
- Clear Error Reporting: Added standardized red console text formatting for all custom exception messages (e.g., DuplicatePhoneException) to clearly distinguish errors from standard output.
- Duplicate Phone Validation: Implemented a check for duplicate phone numbers during member registration, throwing a specific exception instead of encountering a database-level unique constraint violation.

---

# Future Improvements

- Authentication
- Authorization
- Async Programming
- Web API
- JWT Authentication
- Logging
- DTOs
- Validation
- Unit Testing

---

# Conclusion

This project demonstrates a structured enterprise-style backend architecture using C#, .NET, EF Core, and PostgreSQL while implementing clean separation between presentation, business logic, and data access layers.