# Day-18

# Table of Contents

1. HTTP Request Methods
2. RESTful APIs
3. Top-Level Statements
4. Kestrel
5. Microsoft IIS
6. API Parameter Binding
7. Serialization and Deserialization
8. IEnumerable
9. Design Patterns
10. Factory Method Pattern
11. Abstract Factory Pattern

---

# 1. HTTP Request Methods

HTTP methods define the action that should be performed on a resource.

| Method | Purpose |
|---|---|
| GET | Retrieve data |
| POST | Create data |
| PUT | Update entire resource |
| PATCH | Partial update |
| DELETE | Remove data |
| HEAD | Retrieve headers only |
| OPTIONS | Get supported methods |

---

## GET

Used to retrieve data from the server.

Example:

```http
GET /users
```

---

## POST

Used to create new data.

Example:

```http
POST /users
```

---

## PUT

Used to completely update a resource.

Example:

```http
PUT /users/1
```

---

## PATCH

Used for partial updates.

Example:

```http
PATCH /users/1
```

---

## DELETE

Used to remove a resource.

Example:

```http
DELETE /users/1
```

---

## HEAD

Same as GET but returns only headers without response body.

Used for:
- Checking file size
- Resource validation
- Cache validation

---

# 2. RESTful APIs

REST stands for Representational State Transfer.

RESTful APIs use:
- HTTP methods
- Resources
- URLs
- Stateless communication

---

## REST Principles

### Stateless
Each request must contain all required information.

### Resource-Based
Everything is treated as a resource.

Example:
```text
/users
/products
/orders
```

### Uniform Interface
Uses standard HTTP methods.

---

## CRUD Mapping

| CRUD | HTTP Method |
|---|---|
| Create | POST |
| Read | GET |
| Update | PUT/PATCH |
| Delete | DELETE |

---

## REST API Example

### Base URL

```text
https://api.example.com
```

---

### Get All Users

| Property | Value |
|---|---|
| Method | GET |
| Endpoint | `/users` |
| Purpose | Retrieve all users |

#### Request

```http
GET /users HTTP/1.1
Host: api.example.com
```

#### Sample Response

```json
[
  {
    "id": 1,
    "name": "John"
  },
  {
    "id": 2,
    "name": "David"
  }
]
```

---

### Get Single User

| Property | Value |
|---|---|
| Method | GET |
| Endpoint | `/users/1` |
| Purpose | Retrieve a specific user |

#### Request

```http
GET /users/1 HTTP/1.1
Host: api.example.com
```

#### Sample Response

```json
{
  "id": 1,
  "name": "John"
}
```

---

### Create User

| Property | Value |
|---|---|
| Method | POST |
| Endpoint | `/users` |
| Purpose | Create a new user |

#### Request

```http
POST /users HTTP/1.1
Host: api.example.com
Content-Type: application/json
```

#### Request Body

```json
{
  "name": "John"
}
```

#### Sample Response

```json
{
  "id": 1,
  "name": "John"
}
```

---

### Update User

| Property | Value |
|---|---|
| Method | PUT |
| Endpoint | `/users/1` |
| Purpose | Update an existing user |

#### Request

```http
PUT /users/1 HTTP/1.1
Host: api.example.com
Content-Type: application/json
```

#### Request Body

```json
{
  "id": 1,
  "name": "Updated John"
}
```

#### Sample Response

```json
{
  "message": "User Updated Successfully"
}
```

---

### Delete User

| Property | Value |
|---|---|
| Method | DELETE |
| Endpoint | `/users/1` |
| Purpose | Delete a user |

#### Request

```http
DELETE /users/1 HTTP/1.1
Host: api.example.com
```

#### Sample Response

```json
{
  "message": "User Deleted Successfully"
}
```


---

# 3. Top-Level Statements

Top-level statements allow writing C# programs without explicitly creating `Program` class and `Main()` method.

---

## Traditional Approach

```csharp
class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello");
    }
}
```

---

## Top-Level Statements

```csharp
Console.WriteLine("Hello");
```

---

## Advantages

- Less boilerplate code
- Cleaner syntax
- Beginner friendly
- Faster development

---

# 4. Kestrel

Kestrel is the default web server for ASP.NET Core applications.

---

## Features

- Lightweight
- Fast
- Cross-platform
- Supports HTTP and HTTPS

---

## Architecture

```text
Client
   ↓
Kestrel
   ↓
ASP.NET Core Application
```

---

## Default Ports

| Protocol | Port |
|---|---|
| HTTP | 5000 |
| HTTPS | 5001 |

---

# 5. Microsoft IIS

IIS (Internet Information Services) is Microsoft's web server for hosting web applications.

---

## Responsibilities

- Hosting websites
- Managing security
- Handling HTTP requests
- Reverse proxy for Kestrel

---

## IIS Architecture

```text
Client
   ↓
IIS
   ↓
Kestrel
   ↓
ASP.NET Core App
```

---

## Important Components

### Application Pool
Provides process isolation.

### Worker Process
Executes the application.

---

# 6. API Parameter Binding

ASP.NET Core automatically binds incoming request data to method parameters.

---

# Query Parameters

```csharp
[HttpGet("WithName")]
public string GreetWithName(string Name)
{
    return $"Hello {Name}";
}
```

Request:
```text
/api/account/WithName?Name=John
```

---

# FromBody

```csharp
[HttpPost]
public string GreetPost([FromBody] string Name)
{
    return $"Success {Name}";
}
```

Request Body:
```json
"John"
```

---

# DTO / Model Binding

Recommended approach:

```csharp
public class UserRequest
{
    public string Name { get; set; }
    public string Age { get; set; }
}
```

```csharp
[HttpPost]
public string GreetPost([FromBody] UserRequest request)
{
    return $"Success {request.Name}";
}
```

Request:
```json
{
  "name":"John",
  "age":"22"
}
```

---

# 7. Serialization and Deserialization

Serialization converts objects into transferable formats like JSON.

Deserialization converts JSON back into objects.

---

# Serialization

```csharp
User user = new User
{
    Id = 1,
    Name = "John"
};

string json =
    JsonSerializer.Serialize(user);
```

Output:
```json
{
  "Id":1,
  "Name":"John"
}
```

---

# Deserialization

```csharp
User user =
    JsonSerializer.Deserialize<User>(json);
```

---

# Uses

- APIs
- File storage
- Network communication
- Caching

---

# 8. IEnumerable

`IEnumerable` represents a collection that can be iterated using `foreach`.

---

## Example

```csharp
IEnumerable<int> numbers =
    new List<int>() {1,2,3};

foreach(var number in numbers)
{
    Console.WriteLine(number);
}
```

---

## Advantages

- Supports iteration
- Works with LINQ
- Deferred execution
- Better abstraction

---

## IEnumerable vs List

| IEnumerable | List |
|---|---|
| Read-only iteration | Full modification |
| Supports foreach | Supports Add/Remove |
| Lazy execution | Immediate execution |

---

# 9. Design Patterns

Design patterns are reusable solutions to common software problems.

---

# Types of Design Patterns

| Category | Purpose |
|---|---|
| Creational | Object creation |
| Structural | Object relationships |
| Behavioral | Communication logic |

---

## Common Patterns

- Singleton
- Factory
- Repository
- Strategy
- Observer
- Adapter
- Decorator

---

# Singleton Pattern

Ensures only one instance exists.

Example:
```csharp
public class Logger
{
    private static Logger _instance;

    private Logger(){}

    public static Logger GetInstance()
    {
        if(_instance == null)
        {
            _instance = new Logger();
        }

        return _instance;
    }
}
```

---

# 10. Factory Method Pattern

Factory Method provides an interface for creating objects.

---

## Purpose

Avoid direct object creation using `new`.

---

## Structure

| Component | Purpose |
|---|---|
| Product | Common interface |
| Concrete Product | Actual implementation |
| Creator | Factory declaration |
| Concrete Creator | Creates product |

---

## Example

### Product

```csharp
public interface IVehicle
{
    void Drive();
}
```

---

### Concrete Products

```csharp
public class Car : IVehicle
{
    public void Drive()
    {
        Console.WriteLine("Car Driving");
    }
}
```

---

### Factory

```csharp
public abstract class VehicleFactory
{
    public abstract IVehicle CreateVehicle();
}
```

---

### Concrete Factory

```csharp
public class CarFactory : VehicleFactory
{
    public override IVehicle CreateVehicle()
    {
        return new Car();
    }
}
```

---

## Advantages

- Loose coupling
- Better maintainability
- Easy extension
- Centralized object creation

---

# 11. Abstract Factory Pattern

Abstract Factory creates families of related objects.

---

## Example

Furniture factory creates:
- Chair
- Sofa
- Table

for a specific style:
- Modern
- Victorian

---

# Structure

| Component | Purpose |
|---|---|
| Abstract Product | Product interfaces |
| Concrete Product | Actual products |
| Abstract Factory | Creation methods |
| Concrete Factory | Product family creation |

---

## Example

### Abstract Factory

```csharp
public interface IFurnitureFactory
{
    IChair CreateChair();

    ISofa CreateSofa();
}
```

---

### Modern Factory

```csharp
public class ModernFurnitureFactory : IFurnitureFactory
{
    public IChair CreateChair()
    {
        return new ModernChair();
    }

    public ISofa CreateSofa()
    {
        return new ModernSofa();
    }
}
```

---

## Advantages

- Ensures compatible object families
- Loose coupling
- Scalable architecture
- Easy extension

---

# Important Interview Definitions

## RESTful API
An API that follows REST principles using HTTP methods to perform CRUD operations.

---

## Kestrel
Default lightweight web server for ASP.NET Core applications.

---

## IIS
Microsoft web server used for hosting web applications and APIs.

---

## Serialization
Converting an object into a transferable format like JSON.

---

## IEnumerable
An interface that allows iteration over collections using foreach.

---

## Factory Method
A creational design pattern that provides an interface for creating objects.

---

## Abstract Factory
A creational design pattern that creates families of related objects.

---
