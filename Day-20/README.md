# Use case of DTO and Password Hashing

## Introduction

This document contains the concepts studied while learning backend development using ASP.NET Core, Entity Framework Core, Authentication, Authorization, Dependency Injection, Repository Pattern, and Secure API Development.

The purpose of these concepts is to understand how scalable, maintainable, loosely coupled, and secure backend systems are designed and implemented.

---

# 1. Backend Architecture

Backend applications are divided into multiple layers to maintain clean architecture and separation of responsibilities.

## Layered Architecture

```text
Client
↓
Controller Layer
↓
Business Logic Layer
↓
Repository Layer
↓
Database
```

---

## Controller Layer

The controller layer handles HTTP requests and responses.

Responsibilities:
- Receive requests from frontend/client
- Validate request data
- Call service/business layer
- Return responses

Example:

```csharp
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
}
```

---

## Business Logic Layer (BLL)

The business layer contains the application logic.

Responsibilities:
- Apply business rules
- Process data
- Coordinate repositories
- Handle validations

Examples:
- Registering a user
- Validating login
- Processing orders

---

## Repository Layer (DAL)

The repository layer communicates with the database.

Responsibilities:
- Insert data
- Update data
- Delete data
- Retrieve data

This layer isolates database logic from business logic.

---

# 2. Models and DTOs

## Models

Models represent database tables.

Example:

```csharp
public class User
{
    public string Username { get; set; }
    public string Password { get; set; }
}
```

---

## DTOs (Data Transfer Objects)

DTOs are used to transfer data between client and server.

### Request DTO

Used for incoming request data.

```csharp
public class RegisterUserRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}
```

---

### Response DTO

Used for outgoing response data.

```csharp
public class RegisterUserResponse
{
    public int CustomerId { get; set; }
}
```

---

# 3. Repository Pattern

The Repository Pattern abstracts database operations.

Instead of directly writing database queries inside controllers or services, repositories handle data access.

---

## Generic Repository

Generic repositories provide reusable CRUD operations for multiple entities.

### Interface

```csharp
public interface IRepository<TKey, TEntity>
{
    TEntity Create(TEntity entity);
    TEntity Get(TKey key);
}
```

---

## Generic Repository Implementation

```csharp
public class Repository<TKey, TEntity>
    : IRepository<TKey, TEntity>
{
}
```

---

## Benefits

- Reusable code
- Loose coupling
- Easier testing
- Cleaner architecture

---

# 4. Dependency Injection

Dependency Injection is a design pattern used to inject required dependencies automatically.

Instead of manually creating objects, ASP.NET Core provides them through the DI container.

---

## Service Registration

```csharp
builder.Services.AddScoped<
    IRepository<int, Customer>,
    Repository<int, Customer>>();
```

Meaning:

Whenever `IRepository<int, Customer>` is requested,
ASP.NET Core provides `Repository<int, Customer>`.

---

## Dependency Injection Lifetimes

### AddTransient

Creates a new object every time.

### AddScoped

Creates one object per HTTP request.

### AddSingleton

Creates one object for the entire application lifetime.

---

## Benefits of Dependency Injection

- Loose coupling
- Better maintainability
- Easier unit testing
- Cleaner code structure

---

# 5. Authentication

Authentication verifies the identity of a user.

Question answered by authentication:

```text
Who are you?
```

---

## Authentication Methods

- JWT Authentication
- Session Authentication
- OAuth Authentication
- API Key Authentication

---

# 6. Authorization

Authorization determines what an authenticated user can access.

Question answered by authorization:

```text
What are you allowed to access?
```

---

## Role-Based Authorization

Example:

```csharp
[Authorize(Roles = "Admin")]
```

Only users with Admin role can access the endpoint.

---

## Allow Anonymous Access

```csharp
[AllowAnonymous]
```

Used for public APIs such as:
- Login
- Registration

---

# 7. Password Security

Passwords should never be stored as plain text.

Instead, passwords are stored using hashing algorithms.

---

# 8. Hashing

Hashing converts data into a fixed-length irreversible value.

Example:

```text
Password → Hash Function → Hashed Value
```

---

## Properties of Hashing

- One-way process
- Cannot reverse original value
- Used for password storage

---

## Recommended Hashing Algorithms

- BCrypt
- Argon2
- PBKDF2

---

## BCrypt Password Hashing

### Hash Password

```csharp
string hash =
    BCrypt.Net.BCrypt.HashPassword(password);
```

---

### Verify Password

```csharp
bool isValid =
    BCrypt.Net.BCrypt.Verify(password, hash);
```

---

# 9. Encryption

Encryption converts readable data into unreadable data using a key.

Unlike hashing, encrypted data can be decrypted back.

---

## Encryption Workflow

```text
Plain Text
↓
Encryption
↓
Cipher Text
↓
Decryption
↓
Original Text
```

---

## Common Encryption Algorithms

- AES
- RSA

---

# 10. Difference Between Hashing and Encryption

| Hashing | Encryption |
|---|---|
| One-way process | Two-way process |
| Cannot reverse | Can decrypt |
| Used for passwords | Used for secure communication |
| No decryption key | Requires decryption key |

---

# 11. JWT Authentication

JWT stands for JSON Web Token.

JWT is used for stateless authentication.

---

## JWT Structure

```text
Header.Payload.Signature
```

---

## JWT Authentication Flow

```text
User Login
↓
Validate Credentials
↓
Generate JWT Token
↓
Send Token to Client
↓
Client Stores Token
↓
Client Sends Token in API Requests
↓
Server Validates Token
```

---

## Sending JWT in API Request

```http
Authorization: Bearer token
```

---

# 12. Session Storage and Local Storage

Frontend applications can store tokens in browser storage.

---

## Session Storage

- Temporary storage
- Cleared when tab closes

Example:

```javascript
sessionStorage.setItem("token", token);
```

---

## Local Storage

- Persistent storage
- Remains after browser restart

---

## Security Consideration

Session storage and local storage are vulnerable to XSS attacks.

A more secure approach is using HttpOnly cookies.

---

# 13. ASP.NET Core Authentication Middleware

Authentication middleware validates incoming JWT tokens.

---

## Middleware Configuration

```csharp
app.UseAuthentication();
app.UseAuthorization();
```

---

# 14. User Registration Flow

A registration process generally involves:

```text
Receive Request
↓
Map Request to User Object
↓
Map Request to Customer Object
↓
Save User
↓
Link Customer with User
↓
Save Customer
↓
Return Response
```

---

## Linking User and Customer

Example:

```csharp
customer.Username = user.Username;
```

This creates a relationship between customer and user records.

---

# 15. Entity Relationships

Applications often separate authentication data from business data.

---

## User Entity

Stores:
- Username
- Password
- Roles

---

## Customer Entity

Stores:
- Name
- Address
- Phone Number
- Business Information

---

## Relationship Example

```text
Customer.Username
↓
User.Username
```

---

# 16. Exception Handling

Custom exceptions improve error handling and readability.

Example:

```csharp
throw new UnableToCreateEntityException(
    "User or customer object not created");
```

---

# 17. Secure Backend Development Practices

## Password Security

- Never store plain passwords
- Use BCrypt or Argon2
- Use password salting

---

## JWT Security

- Use HTTPS
- Set expiration time
- Secure secret keys
- Use refresh tokens

---

## Authorization Security

- Apply least privilege principle
- Protect sensitive APIs
- Use role-based authorization

---

# 18. Full Backend Workflow

```text
Frontend Request
↓
Controller
↓
Business Logic Layer
↓
Repository Layer
↓
Database
↓
Response Returned
```

---

# 19. Technologies and Concepts Learned

## Technologies

- ASP.NET Core
- Entity Framework Core
- BCrypt
---

## Concepts

- Layered Architecture
- Dependency Injection
- Repository Pattern
- Password Hashing
- Encryption

---
