# Topics Covered

- Excel File Generation using ClosedXML
- GET and POST APIs
- MemoryStream
- File Download APIs
- Mock Logger
- Serilog
- WatchDog Logging
- Filters
- Middleware
- ASP.NET Core Request Pipeline

---

# 1. Excel File Generation using ClosedXML

## Package Installation

```bash
dotnet add package ClosedXML
```

---

# Model

```csharp
public class UserData
{
    public string Name { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public int Age { get; set; }
}
```

---

# POST API

## Purpose

Stores incoming user data.

```csharp
[HttpPost]
public IActionResult AddUser([FromBody] UserData user)
{
    users.Add(user);

    return Ok(new
    {
        Message = "User Added Successfully"
    });
}
```

---

# Concepts Learned

## [HttpPost]

Handles HTTP POST requests.

---

## [FromBody]

Reads JSON data from request body.

---

## IActionResult

Represents HTTP response.

Can return:
- Ok()
- BadRequest()
- File()
- NotFound()

---

## Ok()

Returns HTTP 200 response.

---

# GET API for Excel Download

```csharp
[HttpGet("excel")]
public IActionResult DownloadExcel()
{
    using var workbook = new XLWorkbook();

    var worksheet = workbook.Worksheets.Add("Users");

    worksheet.Cell(1,1).Value = "Name";
    worksheet.Cell(1,2).Value = "Phone";
    worksheet.Cell(1,3).Value = "Email";
    worksheet.Cell(1,4).Value = "Age";

    for(int i = 0; i < users.Count; i++)
    {
        worksheet.Cell(i + 2,1).Value = users[i].Name;
        worksheet.Cell(i + 2,2).Value = users[i].Phone;
        worksheet.Cell(i + 2,3).Value = users[i].Email;
        worksheet.Cell(i + 2,4).Value = users[i].Age;
    }

    using var stream = new MemoryStream();

    workbook.SaveAs(stream);

    stream.Position = 0;

    return File(
        stream.ToArray(),
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Users.xlsx"
    );
}
```

---

# Concepts Learned

## XLWorkbook

Represents Excel workbook.

---

## Worksheet

Represents Excel sheet.

---

## Cell(row,column)

Accesses Excel cell.

Example:

```csharp
worksheet.Cell(1,1)
```

means:

```text
A1
```

---

## for Loop

Iterates through all users.

---

## MemoryStream

Temporary memory storage for file generation.

Benefits:
- Faster
- No disk usage
- Automatic cleanup

---

## stream.Position = 0

Moves stream pointer back to beginning.

Required before returning file.

---

## File()

Returns downloadable file response.

---

# RAM vs Disk Storage

## RAM Storage

Uses:

```csharp
MemoryStream
```

Advantages:
- Fast
- Temporary
- No cleanup needed

---

## Disk Storage

Uses:

```csharp
workbook.SaveAs("Users.xlsx");
```

Advantages:
- Permanent storage
- File history

Disadvantages:
- Slower
- Requires cleanup
- Uses disk space

---

# 2. Mock Logger

# Purpose

Used in unit testing to fake logging behavior.

---

# Package

```bash
dotnet add package Moq
```

---

# Example

```csharp
var mockLogger = new Mock<ILogger<UserService>>();
```

---

# Concepts Learned

## Mocking

Creates fake objects for testing.

---

## ILogger<T>

ASP.NET Core logging abstraction.

---

## mock.Object

Returns fake logger instance.

---

## Verify()

Checks whether logging happened.

Example:

```csharp
mockLogger.Verify(...)
```

---

# Benefits

- Faster testing
- Isolated unit tests
- No real logging

---

# 3. Serilog

# Purpose

Structured logging framework for .NET.

---

# Packages

```bash
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File
```

---

# Basic Configuration

```csharp
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/app.txt")
    .CreateLogger();
```

---

# Concepts Learned

## Structured Logging

Stores logs in structured format.

Example:

```json
{
  "UserName":"Abu"
}
```

---

# Log Levels

- Information
- Warning
- Error
- Fatal
- Debug

---

# WriteTo.Console()

Writes logs into terminal.

---

# WriteTo.File()

Stores logs into file.

---

# Benefits

- Better debugging
- Production logging
- Searchable logs

---

# 4. WatchDog Logging

# Purpose

Real-time monitoring and logging dashboard for ASP.NET Core.

---

# Packages

```bash
dotnet add package WatchDog
dotnet add package WatchDog.src
```

---

# Configuration

```csharp
builder.Services.AddWatchDogServices();

app.UseWatchDogExceptionLogger();

app.UseWatchDog();
```

---

# Features

- API monitoring
- Request tracking
- Exception tracking
- Dashboard UI
- Response monitoring

---

# Dashboard URL

```text
/watchdog
```

---

# Difference Between Serilog and WatchDog

| Serilog | WatchDog |
|---|---|
| Logging Engine | Monitoring Dashboard |
| Structured Logs | Request Monitoring |
| File/DB Logging | UI Dashboard |

---

# 5. Filters

# Purpose

Run code:
- before action
- after action

without repeating logic.

---

# Types of Filters

| Filter | Purpose |
|---|---|
| Authorization Filter | Authentication |
| Action Filter | Before/After action |
| Result Filter | Before/After result |
| Exception Filter | Error handling |
| Resource Filter | Entire MVC request |

---

# Action Filter Example

```csharp
public class MyActionFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        Console.WriteLine("Before Action");
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        Console.WriteLine("After Action");
    }
}
```

---

# Concepts Learned

## IActionFilter

Provides:
- before action
- after action

execution hooks.

---

## OnActionExecuting()

Runs before controller method.

---

## OnActionExecuted()

Runs after controller method.

---

# Register Filter

```csharp
builder.Services.AddScoped<MyActionFilter>();
```

---

# Apply Filter

```csharp
[ServiceFilter(typeof(MyActionFilter))]
```

---

# Exception Filter

Handles unhandled exceptions globally.

---

# 6. Middleware

# Purpose

Processes HTTP requests and responses inside ASP.NET Core pipeline.

---

# Request Pipeline

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

# Built-in Middleware

| Middleware | Purpose |
|---|---|
| Authentication | User verification |
| Authorization | Permission checking |
| Routing | Endpoint matching |
| CORS | Cross-origin access |
| HTTPS Redirection | HTTP → HTTPS |

---

# Middleware Registration

```csharp
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
```

---

# Order Matters

Correct:

```csharp
app.UseAuthentication();
app.UseAuthorization();
```

---

# Custom Middleware Example

```csharp
public class LoggingMiddleware
{
    private readonly RequestDelegate _next;

    public LoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        Console.WriteLine("Request Incoming");

        await _next(context);

        Console.WriteLine("Response Outgoing");
    }
}
```

---

# Concepts Learned

## RequestDelegate

Represents next middleware.

---

## HttpContext

Contains:
- Request
- Response
- Headers
- User
- Cookies

---

## await _next(context)

Passes request to next middleware.

Without this:
- pipeline stops

---

# Register Middleware

```csharp
app.UseMiddleware<LoggingMiddleware>();
```

---

# Terminal Middleware

Stops request pipeline.

Example:

```csharp
app.Run(async context =>
{
    await context.Response.WriteAsync("Hello");
});
```

---

# Use() vs Run()

| Use() | Run() |
|---|---|
| Calls next middleware | Ends pipeline |
| Non-terminal | Terminal |

---

# 7. ASP.NET Core Request Pipeline

# Definition

Sequence of middleware components handling request and response.

---

# Pipeline Flow

```text
Client
   ↓
Middleware 1
   ↓
Middleware 2
   ↓
Middleware 3
   ↓
Controller
   ↓
Response
```

---

# Real Production Pipeline

```text
Client
   ↓
HTTPS Middleware
   ↓
CORS Middleware
   ↓
Authentication Middleware
   ↓
Authorization Middleware
   ↓
Logging Middleware
   ↓
Controller
```

---

# Middleware vs Filters

| Middleware | Filters |
|---|---|
| Entire app | MVC only |
| Global pipeline | Controller level |
| Runs before routing | Runs after routing |

---

# Key Takeaways

- ClosedXML is used for Excel generation
- MemoryStream stores temporary files in RAM
- Mock Logger is used for unit testing
- Serilog provides structured logging
- WatchDog provides monitoring dashboard
- Filters work at MVC/controller level
- Middleware works in global request pipeline
- ASP.NET Core request pipeline executes middleware sequentially
- Middleware order is very important

```