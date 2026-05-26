# API Testing 

## Overview

This module focuses on understanding Unit Testing in C# using NUnit, Entity Framework Core InMemory Database, Repository Pattern, and asynchronous programming concepts. The primary goal was to learn how to test database-related operations without connecting to a real database.

---

# Concepts Learned

## 1. Unit Testing

Unit Testing is used to test small isolated units of code such as:
- Methods
- Services
- Repository functions

Purpose:
- Validate business logic
- Detect bugs early
- Improve maintainability
- Ensure code reliability

---

## 2. NUnit Testing Framework

NUnit is a testing framework used for writing and executing test cases in .NET applications.

### Common NUnit Attributes

| Attribute | Purpose |
|---|---|
| `[Test]` | Marks a test method |
| `[SetUp]` | Runs before every test |
| `[TearDown]` | Runs after every test |
| `[TestFixture]` | Represents test class |

---

## 3. AAA Pattern

The standard structure followed while writing unit tests.

### Arrange
Prepare test data and dependencies.

### Act
Execute the method being tested.

### Assert
Validate expected output.

Example:

```csharp
// Arrange
var calculator = new Calculator();

// Act
var result = calculator.Add(2, 3);

// Assert
Assert.AreEqual(5, result);
```

---

# Repository Pattern

The Repository Pattern is used to separate:
- Data access logic
- Business logic

Benefits:
- Better maintainability
- Loose coupling
- Easier testing
- Cleaner architecture

Example:

```csharp
IRepository<int, Customer> customerRepository;
```

The repository handles:
- Create
- Read
- Update
- Delete operations

---

# Entity Framework Core InMemory Database

## Purpose

Instead of using a real SQL database during testing, an in-memory database is used.

Benefits:
- Faster execution
- No database installation required
- Isolated testing
- Temporary storage

---

## Setup Configuration

```csharp
var options = new DbContextOptionsBuilder<BankingContext>()
    .UseInMemoryDatabase("BankingDb")
    .Options;
```

This creates a temporary fake database inside memory.

---

# Understanding the Setup Method

```csharp
[SetUp]
public void Setup()
```

The setup method runs before every test case.

Responsibilities:
- Create InMemory Database
- Create DbContext
- Initialize Repository

Flow:

```text
Test Starts
    ↓
Setup Executes
    ↓
InMemory Database Created
    ↓
DbContext Initialized
    ↓
Repository Initialized
    ↓
Test Executes
```

---

# DbContext Understanding

`BankingContext` acts as a bridge between:
- C# objects
- Database

Example:

```csharp
BankingContext bankingContext = new BankingContext(options);
```

The DbContext:
- Tracks entities
- Handles database operations
- Manages queries and transactions

---

# Asynchronous Programming in Testing

The tests use async methods.

Example:

```csharp
public async Task AddCustomerPassTest()
```

Concepts learned:
- `async`
- `await`
- `Task`
- Non-blocking operations

---

# Understanding Task

`Task` represents an asynchronous operation that may complete in the future.

Types:
- `Task`
- `Task<T>`

Example:

```csharp
Task<Customer>
```

Represents:
- Future operation
- Returning a `Customer` object later

---

# Understanding Assertions

Assertions validate expected results.

Example:

```csharp
Assert.That(result.Id, Is.EqualTo(customer.Id));
```

Purpose:
- Compare actual vs expected output
- Validate test success

---

# Test Cases Implemented

## Add Customer Test

Purpose:
- Verify customer creation functionality.

Steps:
1. Create customer object
2. Store customer using repository
3. Validate returned customer ID

---

## Get Customer Test

Purpose:
- Verify customer retrieval functionality.

Steps:
1. Add customer
2. Fetch customer using ID
3. Validate retrieved customer name

---

# Important Testing Concepts Learned

## Isolated Testing

Each test should run independently.

---

## Fast Execution

InMemory Database improves testing speed.

---

## Repeatability

Tests should produce consistent results.

---

## Reliability

Tests help ensure application stability.

---

# Important Improvement Identified

Instead of:

```csharp
.UseInMemoryDatabase("BankingDb")
```

Better approach:

```csharp
.UseInMemoryDatabase(Guid.NewGuid().ToString())
```

Reason:
- Prevent shared test data between tests
- Ensure clean isolated database per test

---

# Technologies Used

- C#
- .NET
- NUnit
- Entity Framework Core
- InMemory Database Provider

---

# Architecture Flow

```text
Test Method
    ↓
Repository
    ↓
DbContext
    ↓
InMemory Database
```

---

# Key Learnings Summary

- Learned Unit Testing fundamentals
- Understood NUnit framework
- Implemented AAA Pattern
- Learned Repository Pattern testing
- Understood Entity Framework Core InMemory Database
- Explored async and await concepts
- Learned Task and asynchronous execution
- Practiced writing isolated test cases
- Understood Setup configuration in NUnit
- Learned database-independent testing approach

---

# Conclusion

This module provided practical understanding of backend testing in .NET applications using NUnit and EF Core InMemory Database. The testing approach ensures:
- Faster development
- Reliable functionality
- Better maintainability
- Scalable application architecture

The concepts learned here form the foundation for advanced testing practices in enterprise-level ASP.NET Core applications.