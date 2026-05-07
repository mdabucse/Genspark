# C# Advanced Concepts — Complete Notes

## Table of Contents

1. [Extension Methods](#1-extension-methods)
2. [Delegates](#2-delegates)
3. [Generic Delegates](#3-generic-delegates)
4. [Built-in Delegates](#4-built-in-delegates)
5. [Lambda Expressions](#5-lambda-expressions)
6. [Anonymous Methods](#6-anonymous-methods)
7. [Callback Functions](#7-callback-functions)
8. [Multicast Delegates](#8-multicast-delegates)
9. [Predicate](#9-predicate)
10. [LINQ](#10-linq)
11. [IEnumerable](#11-ienumerable)
12. [IQueryable](#12-iqueryable)
13. [SelectMany and Flattening](#13-selectmany-and-flattening)
14. [Internal Connections Between Concepts](#14-internal-connections-between-concepts)

---

## 1. Extension Methods

### Definition

Extension methods allow adding new methods to existing classes **without modifying the original class**.

### Syntax

```csharp
public static class StringExtensions
{
    public static string Reverse(this string value)
    {
        char[] arr = value.ToCharArray();
        Array.Reverse(arr);
        return new string(arr);
    }
}
```

### Usage

```csharp
string text = "Hello";
Console.WriteLine(text.Reverse());
```

### Internal Understanding

```csharp
// This:
text.Reverse();

// Internally becomes:
StringExtensions.Reverse(text);
```

### Important Rules

- Extension methods must be inside a `static` class
- Extension methods must be `static`
- The `this` keyword defines which data type is extended

> **Key Concept:** Extension methods are static methods disguised as instance methods.

---

## 2. Delegates

### Definition

A **delegate** is a type-safe function pointer. Delegates allow methods to be stored, passed, and invoked dynamically.

### Basic Delegate Declaration

```csharp
public delegate void MyDelegate(int n1, int n2);
```

### Example

```csharp
MyDelegate del = Add;
del(10, 20);
```

### Signature Matching

The delegate and method signatures must match:
- Same parameter count
- Same parameter types
- Same return type

> **Core Purpose:** Delegates allow behavior to be passed dynamically.

---

## 3. Generic Delegates

### Definition

Generic delegates allow flexible parameter types, avoiding the need to create separate delegates for different data types.

### Example

```csharp
public delegate void MyDelegate<T, K>(T n1, K n2);
```

### Usage

```csharp
MyDelegate<int, string> del = MyMethod;
```

---

## 4. Built-in Delegates

### `Action`

Used when a method **returns void**.

```csharp
Action<int, int>
// Equivalent to: void Method(int a, int b) {}
```

### `Func`

Used when a method **returns a value**. The last type parameter is always the return type.

```csharp
Func<int, int, int>
// parameter1 → int
// parameter2 → int
// return type → int
```

### `Predicate`

A special delegate that takes **one parameter** and **returns bool**.

```csharp
Predicate<int>
// Equivalent to: bool Check(int x) {}
```

---

## 5. Lambda Expressions

### Definition

Short syntax for writing anonymous methods. The compiler converts a lambda into a hidden method + delegate.

### Syntax

```csharp
(x, y) => x + y
```

### Equivalent Named Method

```csharp
int Add(int x, int y)
{
    return x + y;
}
```

### Example

```csharp
Func<int, int, int> add = (a, b) => a + b;
```

---

## 6. Anonymous Methods

### Definition

Methods defined inline **without a name**.

### Syntax

```csharp
delegate(int a, int b)
{
    Console.WriteLine(a + b);
};
```

> **Note:** Lambda expressions have largely replaced anonymous methods in modern C#.

---

## 7. Callback Functions

### Definition

A method **passed into another method** to be executed later.

### Example

```csharp
void DoWork(Action callback)
{
    callback();
}

// Usage
DoWork(() =>
{
    Console.WriteLine("Completed");
});
```

### Real-World Usage

- Button click handlers
- Async programming
- API responses
- Timers
- Events

---

## 8. Multicast Delegates

### Definition

Delegates can hold references to **multiple methods** and invoke them all in sequence.

### Adding Methods

```csharp
delegateRef += Add;
delegateRef += Product;
```

### Removing Methods

```csharp
delegateRef -= Add;
```

> **Internal Concept:** The delegate maintains an **invocation list** internally.

---

## 9. Predicate

### Definition

A built-in delegate specifically for **condition checking**.

### Example

```csharp
Predicate<int> isEven = x => x % 2 == 0;
Console.WriteLine(isEven(10)); // True
```

### Common Collection Methods That Accept Predicates

| Method | Purpose |
|---|---|
| `Find()` | Returns first matching element |
| `FindAll()` | Returns all matching elements |
| `Exists()` | Checks if any element matches |
| `RemoveAll()` | Removes all matching elements |

---

## 10. LINQ

### Definition

**Language Integrated Query** — used for filtering, sorting, transforming, and querying collections.

### Namespace

```csharp
using System.Linq;
```

### Common Methods

| Method | Purpose |
|---|---|
| `Where` | Filter elements |
| `Select` | Transform elements |
| `OrderBy` | Sort elements |
| `Count` | Count elements |
| `Any` | Check if any element exists |
| `First` | Get the first element |
| `Sum` | Sum values |

### Method Syntax

```csharp
var even = nums.Where(x => x % 2 == 0);
```

### Query Syntax

```csharp
var result =
    from n in nums
    where n > 5
    select n;
```

> **Internal Connection:** LINQ heavily relies on **Delegates**, **Lambdas**, and **Extension Methods**.

---

## 11. IEnumerable

### Definition

Represents a collection that can be **iterated** (read-only, forward-only).

```csharp
IEnumerable<int> nums
```

### Purpose

Supports `foreach`, LINQ, and general iteration.

### How `foreach` Works Internally

```csharp
IEnumerator<int> enumerator = nums.GetEnumerator();
while (enumerator.MoveNext())
{
    var value = enumerator.Current;
}
```

### Key Limitation

`IEnumerable` guarantees **iteration only**. It does **not** support:
- `Add`
- `Remove`
- Index access

> **Execution:** Data is fetched first, then filtered in memory.

---

## 12. IQueryable

### Definition

Represents a query that can be **translated into another query language** (usually SQL), used with Entity Framework and databases.

### Difference from `IEnumerable`

| | `IEnumerable` | `IQueryable` |
|---|---|---|
| **Filtering** | Fetch all data → filter in memory | Filter first → fetch only needed data |
| **Best for** | In-memory collections | Remote databases |
| **Uses** | Delegates | Expression Trees |

### Example

```csharp
var users = db.Users.Where(x => x.Age > 18);
```

Translated to SQL:

```sql
SELECT * FROM Users
WHERE Age > 18
```

---

## 13. SelectMany and Flattening

### Purpose

Flatten **nested collections** into a single sequence.

### Example

```csharp
List<string> names = { "Pranaya", "Kumar" };

IEnumerable<char> result =
    from str in names
    from ch in str
    select ch;
```

### Equivalent `foreach` Logic

```csharp
foreach (string str in names)
{
    foreach (char ch in str)
    {
        // process ch
    }
}
```

### Method Syntax Equivalent

```csharp
names.SelectMany(str => str);
```

### Output

```
P r a n a y a K u m a r
```

---

## 14. Internal Connections Between Concepts

### Relationship Flow

```
Extension Methods
       ↓
   Delegates
       ↓
Lambda Expressions
       ↓
Predicate / Func / Action
       ↓
     LINQ
       ↓
  IEnumerable
       ↓
  IQueryable
```

### Core Architecture Summary

| Concept | Purpose |
|---|---|
| Extension Methods | Add methods to existing types |
| Delegates | Pass behavior dynamically |
| Lambda | Short anonymous methods |
| Predicate | Condition checking |
| LINQ | Query collections |
| IEnumerable | Iterate collections |
| IQueryable | Remote query translation |

### Foundation of Modern C#

These concepts form the foundation of:

- **ASP.NET Core**
- **Entity Framework**
- **Async Programming**
- **Event Systems**
- **Middleware Pipelines**
- **Functional Programming in C#**

---

## Quick Reference — Final Definitions

| Term | Definition |
|---|---|
| **Extension Method** | Static method that behaves like an instance method |
| **Delegate** | Type-safe function pointer |
| **Lambda** | Short anonymous function |
| **Predicate** | Delegate that returns `bool` |
| **IEnumerable** | Collection that supports iteration |
| **IQueryable** | Queryable data source that can translate queries |
| **LINQ** | Language Integrated Query for querying collections and data sources |