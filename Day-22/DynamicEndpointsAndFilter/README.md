# Dynamic Endpoints, Filtering & Pagination in ASP.NET Core

## Introduction

This document explains the concepts learned while implementing:

- Dynamic Endpoints
- Filtering
- Pagination
- IQueryable
- Deferred Execution
- Minimal APIs
- LINQ Query Building

using ASP.NET Core Minimal APIs and Entity Framework Core.

---

# 1. Minimal APIs

Minimal APIs allow us to create lightweight HTTP endpoints without controllers.

## Example

```csharp
app.MapGet("/hello", () =>
{
    return "Hello World";
});
```

## Request

```text
GET /hello
```

## Response

```text
Hello World
```

---

# 2. Dynamic Endpoints

Dynamic endpoints are routes generated at runtime instead of hardcoding routes manually.

## Static Endpoint

```csharp
app.MapGet("/products", () =>
{
    return "Products";
});
```

---

## Dynamic Endpoint

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

## Generated Routes

```text
/api/products
/api/orders
/api/customers
```

---

# 3. Route Parameters

Route parameters allow endpoints to accept dynamic values.

## Example

```csharp
app.MapGet("/buses/{id}", (int id) =>
{
    return $"Bus Id: {id}";
});
```

## Request

```text
GET /buses/10
```

## Response

```text
Bus Id: 10
```

---

# 4. Query Parameters

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

# 5. Dynamic Query Building

Dynamic query building allows queries to be modified conditionally.

## Example

```csharp
var query = db.Buses.AsQueryable();

if (!string.IsNullOrEmpty(from))
{
    query = query.Where(x => x.From == from);
}

if (isAC.HasValue)
{
    query = query.Where(x => x.IsAC == isAC.Value);
}
```

## Generated SQL

```sql
SELECT *
FROM Buses
WHERE From = 'Chennai'
AND IsAC = true
```

---

# 6. AsQueryable()

`AsQueryable()` converts data into `IQueryable`.

## Purpose

- Deferred Execution
- Dynamic Query Composition
- SQL Translation

## Example

```csharp
var query = db.Buses.AsQueryable();
```

---

# 7. Deferred Execution

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

SQL executes only at:

```csharp
ToList()
```

---

# 8. IQueryable vs IEnumerable

## IQueryable

```csharp
IQueryable<Bus> query = db.Buses;
```

### Features

- SQL generated dynamically
- Filtering happens in database
- Efficient for large datasets

---

## IEnumerable

```csharp
IEnumerable<Bus> buses = db.Buses.ToList();
```

### Problems

- Loads all rows into memory
- Filtering happens in C#
- Poor performance

---

# 9. Filtering

Filtering dynamically adds conditions to queries.

## Example

```csharp
if (!string.IsNullOrEmpty(from))
{
    query = query.Where(x => x.From == from);
}
```

## Request

```text
/buses?from=Chennai
```

---

# 10. Pagination

Pagination fetches records page by page.

## Purpose

- Reduce memory usage
- Improve performance
- Reduce network traffic

---

# 11. Pagination Formula

## Formula

```text
Skip = (PageNumber - 1) * PageSize
```

## Example

```text
PageNumber = 2
PageSize = 5

Skip = (2 - 1) * 5 = 5
```

Meaning:

```text
Skip first 5 rows
Take next 5 rows
```

---

# 12. Skip and Take

## Example

```csharp
var buses = query
    .OrderBy(x => x.Id)
    .Skip((pageNumber - 1) * pageSize)
    .Take(pageSize)
    .ToList();
```

## Generated SQL

```sql
SELECT *
FROM Buses
ORDER BY Id
OFFSET 5 ROWS
FETCH NEXT 5 ROWS ONLY
```

---

# 13. Why OrderBy is Mandatory

Pagination must always use ordering.

## Correct

```csharp
query.OrderBy(x => x.Id)
```

## Without Ordering

Problems:
- Duplicate rows
- Missing rows
- Inconsistent pagination

---

# 14. Count()

`Count()` calculates total records before pagination.

## Example

```csharp
var totalRecords = query.Count();
```

## Generated SQL

```sql
SELECT COUNT(*)
FROM Buses
```

## Purpose

Frontend uses it for:
- Total pages
- Pagination buttons

---

# 15. Total Pages Formula

## Formula

```text
TotalPages = Ceiling(TotalRecords / PageSize)
```

## Example

```text
TotalRecords = 103
PageSize = 10

TotalPages = 11
```

---

# 16. Safe Page Size

Always limit maximum page size.

## Example

```csharp
pageSize = Math.Min(pageSize, 50);
```

## Purpose

Prevents:
- Huge database load
- Memory overuse
- API abuse

---

# 17. Results.Ok()

Used in Minimal APIs to return HTTP responses.

## Example

```csharp
return Results.Ok(data);
```

## Returns

- HTTP 200 OK
- JSON Response

---

# 18. Full Pagination and Filtering Example

```csharp
app.MapGet("/buses", (
    AppDbContext db,
    string? from,
    string? to,
    bool? isAC,
    int pageNumber = 1,
    int pageSize = 5) =>
{
    pageSize = Math.Min(pageSize, 50);

    var query = db.Buses.AsQueryable();

    if (!string.IsNullOrEmpty(from))
    {
        query = query.Where(x => x.From == from);
    }

    if (!string.IsNullOrEmpty(to))
    {
        query = query.Where(x => x.To == to);
    }

    if (isAC.HasValue)
    {
        query = query.Where(x => x.IsAC == isAC.Value);
    }

    var totalRecords = query.Count();

    var buses = query
        .OrderBy(x => x.Id)
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
        .ToList();

    return Results.Ok(new
    {
        TotalRecords = totalRecords,
        PageNumber = pageNumber,
        PageSize = pageSize,
        Data = buses
    });
});
```

---

# 19. Backend Request Flow

```text
Request
   ↓
Query Parameters
   ↓
AsQueryable()
   ↓
Filtering
   ↓
Sorting
   ↓
Pagination
   ↓
SQL Generation
   ↓
Database Execution
   ↓
JSON Response
```

---

# 20. Key Concepts Learned

## Dynamic Endpoints

Routes generated dynamically at runtime.

---

## IQueryable

Builds SQL dynamically.

---

## Deferred Execution

SQL executes only at terminal methods like:
- ToList()
- Count()

---

## Filtering

Dynamic query conditions using:
- Where()

---

## Pagination

Implemented using:
- Skip()
- Take()

---

## Results.Ok()

Returns HTTP 200 response with JSON data.

---

# 21. Important Interview Questions

## What is IQueryable?

`IQueryable` allows LINQ queries to be translated into SQL and executed in the database.

---

## Why use AsQueryable()?

To support dynamic query composition and deferred execution.

---

## Why should pagination use OrderBy()?

Without ordering, SQL does not guarantee row order, causing inconsistent pagination.

---

## Difference between IQueryable and IEnumerable?

### IQueryable
- Executes in database
- Efficient
- Generates SQL

### IEnumerable
- Executes in memory
- Loads all data first
- Poor for large datasets

---

## What is Deferred Execution?

LINQ queries are executed only when terminal methods like:
- ToList()
- Count()
- FirstOrDefault()

are called.