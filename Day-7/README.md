# Day 7

## Overview

This document summarizes the key programming concepts and design principles covered while building the User Account CRUD system with Email and SMS notification in C#. The focus is on understanding not just how the system works, but why each concept is used.

---

## 1. Object-Oriented Programming (OOP)

### Class and Object

A class defines the structure of data and behavior. Objects are instances of classes.

Example:

```csharp
class Account
{
    public string AccountNumber { get; set; }
    public float Balance { get; set; }
}
```

### Encapsulation

Data and related methods are grouped together inside a class.

---

## 2. Models (Data Layer)

Models define the shape of data used in the application.

Examples:

* Account
* UserDetails

These classes represent real-world entities.

---

## 3. Interfaces

Interfaces define contracts that classes must implement.

Example:

```csharp
interface IRepository<K, T>
{
    T Create(T value);
    T? Read(K key);
    T? Update(K key, T value);
    T? Delete(K key);
}
```

Purpose:

* Enforces consistency
* Enables loose coupling
* Improves testability

---

## 4. Generics

Generics allow writing reusable and type-safe code.

Example:

```csharp
IRepository<string, Account>
```

Benefits:

* Code reuse
* Type safety
* Cleaner design

---

## 5. Repository Pattern

The repository pattern abstracts data access logic.

Responsibilities:

* Perform CRUD operations
* Interact with data storage (Dictionary in this case)

Example:

```csharp
class AccountRepository : IRepository<string, Account>
```

---

## 6. Separation of Concerns

Different parts of the system handle different responsibilities.

| Layer      | Responsibility   |
| ---------- | ---------------- |
| Model      | Data structure   |
| Repository | Data access      |
| Service    | Business logic   |
| Program    | User interaction |

---

## 7. Service Layer

The service layer contains business logic and coordinates between repository and other services.

Example:

* AccountService
* NotificationService

Responsibilities:

* Apply rules
* Trigger notifications
* Control workflow

---

## 8. Dependency Injection (Conceptual)

Objects depend on abstractions (interfaces) rather than concrete implementations.

Example:

```csharp
INotification notification = new EmailNotification();
```

---

## 9. Collections

### Dictionary

Used as in-memory data storage.

Example:

```csharp
Dictionary<string, Account>
```

Features:

* Key-value storage
* Fast lookup

### List

Used for iteration and sorting.

---

## 10. CRUD Operations

Core operations supported by the system:

* Create
* Read
* Update
* Delete

These are implemented in the repository.

---

## 11. Error Handling and Null Safety

### Null Coalescing Operator

```csharp
Console.ReadLine() ?? "0"
```

Used to prevent null reference issues.

### Nullable Types

```csharp
T?
```

Indicates that a method can return null.

---

## 12. Data Types and Overflow Handling

Understanding limits of data types:

* int has limited range
* long is used for larger values

Fix:

```csharp
long.Parse(...)
```

---

## 13. Console Input Handling

Reading user input safely:

```csharp
float.Parse(Console.ReadLine() ?? "0");
```

Better approach:

```csharp
float.TryParse(...)
```

---

## 14. Menu-Driven Application

Using loops and conditional logic to build interactive console applications.

Example:

```csharp
while (true)
{
    // menu logic
}
```

---

## 15. Notification System

### Strategy Pattern (Conceptual)

Different notification types implement a common interface.

Example:

* EmailNotification
* SmsNotification

Interface:

```csharp
interface INotification
{
    void Send(UserDetails userDetails, string message);
}
```

---

## 16. SMTP Email Integration

Using System.Net.Mail to send emails.

Concepts:

* SMTP server configuration
* Credentials handling
* Exception handling

---

## 17. Indexers (Conceptual)

Allow objects to be accessed like arrays using [] syntax.

---

## 18. Partial Classes (Conceptual)

Splitting a class across multiple files for better organization.

---

## 19. Method Overriding vs Shadowing

Understanding differences between:

* override (runtime polymorphism)
* new (method hiding)

---

## 20. IComparable Interface

Used for sorting objects.

Example:

```csharp
class Account : IComparable<Account>
```

---

## 21. Clean Code Practices

* Proper naming conventions (PascalCase)
* Separation of logic
* Avoiding duplication
* Structured project organization

---

## Conclusion

This project covers a wide range of foundational and intermediate C# concepts, including OOP, design patterns, generics, and system design principles. It serves as a strong base for building scalable backend systems and transitioning to frameworks like ASP.NET Core.

---
