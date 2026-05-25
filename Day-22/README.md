# ASP.NET Core Backend Concepts Learned

# Introduction

This document summarizes all the backend concepts studied while building APIs using:

- ASP.NET Core Minimal APIs
- Entity Framework Core
- PostgreSQL
- LINQ
- Dynamic Query Building

---

# 1. Minimal APIs

Minimal APIs are lightweight APIs introduced in ASP.NET Core for quickly creating HTTP endpoints without controllers.

## Example

```csharp
app.MapGet("/hello", () =>
{
    return "Hello World";
});
```

---

# 2. HTTP Methods

## GET

Used to fetch data.

```csharp
app.MapGet("/buses", () =>
{
    return "All Buses";
});
```

---

## POST

Used to create data.

```csharp
app.MapPost("/buses", () =>
{
    return "Bus Created";
});
```

---

## PUT

Used to update data.

```csharp
app.MapPut("/buses/{id}", (int id) =>
{
    return $"Updated Bus {id}";
});
```

---

## DELETE

Used to delete data.

```csharp
app.MapDelete("/buses/{id}", (int id) =>
{
    return $"Deleted Bus {id}";
});
```

---

# 3. Route Mapping

`MapGet`, `MapPost`, `MapPut`, and `MapDelete` map URLs to handler functions.

## Example

```csharp
app.MapGet("/students", () =>
{
    return "Students Endpoint";
});
```

---

# 4. Route Parameters

Route parameters allow dynamic values inside URLs.

## Example

```csharp
app.MapGet("/students/{id}", (int id) =>
{
    return $"Student Id: {id}";
});
```

## Request

```text
/students/10
```

---

# 5. Query Parameters

Query parameters are used for:
- Filtering
- Pagination
- Search
- Sorting

## Example

```text
/buses?from=Chennai&isAC=true
```

---

# 6. Dynamic Endpoints

Dynamic endpoints are generated at runtime instead of manually hardcoding routes.

## Example

```csharp
var modules = new[] { "products", "orders", "customers" };

foreach (var module in modules)
{
    app.MapGet($"/api/{module}", () =>
    {
        return $"Welcome to {module}";
    });
}
```

## Generated Endpoints

```text
/api/products
/api/orders
/api/customers
```

---

# 7. Dynamic Query Building

Dynamic query building allows conditions to be added step by step.

## Example

```csharp
var query = db.Buses.AsQueryable();

if (!string.IsNullOrEmpty(from))
{
    query = query.Where(x => x.From == from);
}
```

---

# 8. AsQueryable()

`AsQueryable()` converts data into `IQueryable`.

## Purpose

- Dynamic query composition
- Deferred execution
- SQL translation

## Example

```csharp
var query = db.Buses.AsQueryable();
```

---

# 9. IQueryable

`IQueryable` builds SQL dynamically and executes queries inside the database.

## Example

```csharp
IQueryable<Bus> query = db.Buses;
```

## Advantages

- Efficient
- SQL-side execution
- Supports filtering and pagination

---

# 10. IEnumerable

`IEnumerable` loads data into memory first.

## Example

```csharp
IEnumerable<Bus> buses = db.Buses.ToList();
```

## Problems

- Loads all rows into memory
- Poor performance for large datasets

---

# 11. Deferred Execution

LINQ queries are not executed immediately.

Execution happens only when:
- `ToList()`
- `Count()`
- `FirstOrDefault()`

are called.

## Example

```csharp
var query = db.Buses.AsQueryable();

query = query.Where(x => x.IsAC);

var result = query.ToList();
```

---

# 12. Filtering

Filtering dynamically applies conditions.

## Example

```csharp
if (!string.IsNullOrEmpty(from))
{
    query = query.Where(x => x.From == from);
}
```

---

# 13. Search

Search is implemented using:
- `Contains()`
- `StartsWith()`

## Example

```csharp
query = query.Where(x =>
    x.BusName.Contains(search));
```

---

# 14. Pagination

Pagination fetches data page by page instead of loading everything.

## Purpose

- Better performance
- Reduced memory usage
- Faster APIs

---

# 15. Pagination Formula

## Formula

```text
Skip = (PageNumber - 1) * PageSize
```

## Example

```text
PageNumber = 2
PageSize = 5

Skip = 5
```

Meaning:
- Skip first 5 rows
- Fetch next 5 rows

---

# 16. Skip()

`Skip()` ignores rows.

## Example

```csharp
.Skip(10)
```

Meaning:
- Ignore first 10 rows

---

# 17. Take()

`Take()` fetches rows.

## Example

```csharp
.Take(5)
```

Meaning:
- Fetch next 5 rows

---

# 18. OrderBy()

Pagination must always use ordering.

## Example

```csharp
.OrderBy(x => x.Id)
```

## Why Important

Without ordering:
- Duplicate rows
- Missing rows
- Inconsistent pagination

---

# 19. Count()

`Count()` calculates total records.

## Example

```csharp
var totalRecords = query.Count();
```

---

# 20. Total Pages Formula

## Formula

```text
TotalPages = Ceiling(TotalRecords / PageSize)
```

---

# 21. Safe Page Size

Always limit maximum page size.

## Example

```csharp
pageSize = Math.Min(pageSize, 50);
```

## Purpose

Prevents:
- Huge memory usage
- Server overload
- API abuse

---

# 22. Results.Ok()

Used in Minimal APIs to return HTTP responses.

## Example

```csharp
return Results.Ok(data);
```

## Returns

- HTTP 200 OK
- JSON Response

---

# 23. DbContext

`DbContext` manages database interaction in Entity Framework Core.

## Example

```csharp
public class AppDbContext : DbContext
{
    public DbSet<Bus> Buses { get; set; }
}
```

---

# 24. DbSet

`DbSet` represents a database table.

## Example

```csharp
public DbSet<Bus> Buses { get; set; }
```

---

# 25. Entity Model

Models represent database tables.

## Example

```csharp
public class Bus
{
    public int Id { get; set; }

    public string BusName { get; set; }

    public string From { get; set; }

    public string To { get; set; }

    public bool IsAC { get; set; }

    public decimal Price { get; set; }

    public int AvailableSeats { get; set; }
}
```

---

# 26. Database Migration

Migrations create and update database schema.

## Create Migration

```bash
dotnet ef migrations add InitialCreate
```

---

## Update Database

```bash
dotnet ef database update
```

---

# 27. SQL Generated by EF Core

Entity Framework Core converts LINQ into SQL.

## Example LINQ

```csharp
query.Where(x => x.IsAC)
```

## Generated SQL

```sql
SELECT *
FROM Buses
WHERE IsAC = true
```

---

# 28. SQL Pagination

## Generated SQL

```sql
SELECT *
FROM Buses
ORDER BY Id
OFFSET 5 ROWS
FETCH NEXT 5 ROWS ONLY
```

---

# 29. Dynamic Query Flow

```text
Request
   ↓
Query Parameters
   ↓
AsQueryable()
   ↓
Where()
   ↓
OrderBy()
   ↓
Skip()
   ↓
Take()
   ↓
ToList()
   ↓
SQL Generation
   ↓
Database Execution
   ↓
JSON Response
```

---

# 30. Common Backend Flow

```text
Frontend Request
        ↓
Minimal API Endpoint
        ↓
Entity Framework Core
        ↓
LINQ Query
        ↓
SQL Generation
        ↓
PostgreSQL
        ↓
Response Returned
```

---

# 31. Common Interview Questions

## What is IQueryable?

`IQueryable` allows LINQ queries to be translated into SQL and executed inside the database.

---

## Difference between IQueryable and IEnumerable?

### IQueryable
- Executes in database
- Efficient
- Generates SQL

### IEnumerable
- Executes in memory
- Loads all data first

---

## Why use AsQueryable()?

To support:
- Dynamic query composition
- Deferred execution
- SQL translation

---

## Why should pagination use OrderBy()?

Without ordering, SQL does not guarantee row order, causing inconsistent pagination.

---

## What is Deferred Execution?

LINQ queries execute only when terminal methods like:
- `ToList()`
- `Count()`
- `FirstOrDefault()`

are called.

---

# 32. Concepts Learned Summary

## ASP.NET Core
- Minimal APIs
- Route Mapping
- HTTP Methods
- Route Parameters
- Query Parameters

---

## Entity Framework Core
- DbContext
- DbSet
- LINQ
- IQueryable
- Deferred Execution
- SQL Translation

---

## Query Concepts
- Filtering
- Search
- Pagination
- Sorting
- Dynamic Query Building

---

## Pagination Concepts
- Skip()
- Take()
- OrderBy()
- Count()
- Total Pages
- Safe Page Size

---

## Database Concepts
- PostgreSQL
- SQL Queries
- OFFSET
- FETCH NEXT
- Migrations
```