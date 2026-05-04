# OOP Concepts in the Bus Booking Backend
### Project: BusBooking.API (ASP.NET Core / C#)

---

## Introduction

This document explains how the four core Object-Oriented Programming (OOP) pillars —
**Encapsulation**, **Abstraction**, **Inheritance**, and **Polymorphism** — are
systematically applied throughout the Bus Booking backend project.

The backend is built using **ASP.NET Core** with **Entity Framework Core** and follows
a **Layered Architecture** pattern:

```
Controllers  →  Interfaces  →  Services  →  Models  →  Database (AppDbContext)
```

Each layer is deliberately designed around OOP principles to keep the code clean,
maintainable, and scalable.

---

## 1. Encapsulation

> **Definition:** Bundling data (fields) and the methods that operate on that data into
> a single unit (class), while restricting direct access to internal state.

### 1.1 Model Classes — Data Encapsulation with Properties

Every database entity is represented as a C# class whose fields are exposed only through
controlled **Properties** (`{ get; set; }`). Direct field access is never allowed.

**File:** `Models/User.cs`
```csharp
public class User
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(255)]
    public string PasswordHash { get; set; } = string.Empty;  // Never stores raw password

    [Required, MaxLength(20)]
    public string Role { get; set; } = "customer";   // Defaults enforced here

    public bool IsActive { get; set; } = true;
    public bool IsVerified { get; set; } = false;

    // Navigation properties (relationships are encapsulated too)
    public ICollection<Bus> Buses { get; set; } = new List<Bus>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
```

**Key points:**
- The password is never stored as plain text — only `PasswordHash` is exposed.
- Default values like `Role = "customer"` and `IsActive = true` are set inside the
  class, preventing inconsistent object creation from the outside.
- Navigation properties (`Buses`, `Bookings`) are encapsulated as collections, hiding
  the EF Core relationship internals.

**File:** `Models/Bus.cs`
```csharp
public class Bus
{
    public int Id { get; set; }
    public int OperatorId { get; set; }
    public string BusNumber { get; set; } = string.Empty;
    public string SeatLayout { get; set; } = "2x2";   // Default layout
    public bool HasUpperDeck { get; set; } = false;

    // Relationships encapsulated as collections
    public ICollection<Seat> Seats { get; set; } = new List<Seat>();
    public ICollection<Trip> Trips { get; set; } = new List<Trip>();
}
```

### 1.2 Service Classes — Private Fields and Constructor Injection

**File:** `Services/AuthService.cs`
```csharp
public class AuthService : IAuthService
{
    // Private readonly fields — completely hidden from outside
    private readonly AppDbContext _db;
    private readonly JwtHelper _jwt;

    // Dependency is injected through constructor — controlled entry point
    public AuthService(AppDbContext db, JwtHelper jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        // Internal logic is hidden; callers only see the method signature
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            throw new ArgumentException("Email already registered");

        var user = new User
        {
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password), // Hashing hidden here
            IsActive = dto.Role.ToLower() == "customer"
        };
        ...
    }
}
```

**Key points:**
- `_db` and `_jwt` are `private readonly` — they cannot be accessed or mutated from
  outside the class.
- The password hashing logic (`BCrypt.HashPassword`) is completely internal to `AuthService`.
  The controller never knows how passwords are hashed.

**File:** `Services/BusService.cs`
```csharp
public class BusService : IBusService
{
    private readonly AppDbContext _db;
    private readonly IEmailService _emailService;

    // Private static helper methods — completely hidden from callers
    private static string GenerateSeatLabel(int index, string layout) { ... }
    private static string GetSeatType(int index, string layout) { ... }
    private static BusResponseDto MapToDto(Bus bus) { ... }
}
```

The seat labeling algorithm (e.g., `A1`, `B2`) and the DTO mapping logic are
`private static` methods, invisible to any external caller.

### 1.3 Controller Classes — Encapsulated Service Dependency

**File:** `Controllers/AdminController.cs`
```csharp
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IEmailService _emailService;
    private readonly ILogger<AdminController> _logger;
    private readonly IRouteService _routeService;

    // Audit logging is an internal private helper — not exposed as an API endpoint
    private async Task LogActionAsync(string action, string description, ...)
    {
        var log = new Models.AuditLog { ... };
        _db.AuditLogs.Add(log);
        await _db.SaveChangesAsync();
    }
}
```

`LogActionAsync` is a `private` helper. External users can never call it directly —
it is only triggered internally when a sensitive admin action (like blocking an operator)
is performed.

---

## 2. Abstraction

> **Definition:** Exposing only what is necessary (the "what"), while hiding the
> complex implementation details (the "how").

### 2.1 Interfaces as Contracts

Every service has a corresponding **interface** in the `Interfaces/` folder. The
controllers and other consumers depend on these interfaces, not on the concrete classes.

**File:** `Interfaces/IAuthService.cs`
```csharp
public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<UserProfileDto> GetProfileAsync(int userId);
    Task<UserProfileDto> UpdateProfileAsync(int userId, UpdateProfileDto dto);
}
```

**File:** `Interfaces/IBusService.cs`
```csharp
public interface IBusService
{
    Task<List<BusResponseDto>> GetAllBusesAsync();
    Task<BusResponseDto?> GetBusByIdAsync(int id);
    Task<BusResponseDto> CreateBusAsync(CreateBusDto dto, int operatorId);
    Task<BusResponseDto> UpdateBusAsync(int id, UpdateBusDto dto, int operatorId);
    Task<bool> DeleteBusAsync(int id, int operatorId);
    Task<BusResponseDto> ToggleBusStatusAsync(int id, int operatorId);
    Task<BusResponseDto> UpdateBusLayoutAsync(int id, UpdateBusLayoutDto dto, int operatorId);
}
```

**File:** `Interfaces/IBookingService.cs`
```csharp
public interface IBookingService
{
    Task<BookingResponseDto> CreateBookingAsync(CreateBookingDto dto, int userId);
    Task<List<BookingResponseDto>> GetUserBookingsAsync(int userId);
    Task<BookingResponseDto?> GetBookingDetailsAsync(int bookingId, int userId);
    Task CancelBookingAsync(int bookingId, int userId);
    Task<CancellationQuoteDto> GetCancellationQuoteAsync(int bookingId, int userId);
}

public interface ISeatService
{
    Task<SeatLockResponseDto> LockSeatsAsync(int tripId, int[] seatIds, int userId);
}
```

**File:** `Interfaces/IRouteService.cs`
```csharp
public interface IRouteService
{
    Task<List<RouteResponseDto>> GetAllRoutesAsync();
    Task<List<string>> GetSourcesAsync(string? query);
    Task<List<string>> GetDestinationsAsync(string? source, string? query);
    Task<RouteResponseDto> CreateRouteAsync(CreateRouteDto dto);
    Task<RouteResponseDto> UpdateRouteAsync(int id, CreateRouteDto dto);
    Task<bool> DeleteRouteAsync(int id);
    Task AddBoardingPointAsync(int routeId, CreateBoardingPointDto dto);
    Task<List<BoardingPointDto>> GetBoardingPointsAsync(int routeId);
}
```

### 2.2 How Controllers Consume the Abstraction

**File:** `Controllers/AuthController.cs`
```csharp
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService; // Depends on the INTERFACE, not the class

    public AuthController(IAuthService authService)
    {
        _authService = authService; // Injected at runtime by the DI container
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        // AuthController has NO idea how registration works internally
        var result = await _authService.RegisterAsync(dto);
        return Ok(result);
    }
}
```

The `AuthController` knows only that `IAuthService` has a `RegisterAsync` method.
It has zero knowledge of BCrypt, the database structure, or JWT generation.
This is abstraction in action.

### 2.3 DTO Abstraction (Data Transfer Objects)

DTOs like `RegisterDto`, `LoginDto`, `AuthResponseDto`, and `BookingResponseDto` are
another layer of abstraction. They ensure:
- External API consumers never see internal database model fields (e.g., `PasswordHash`).
- The API contract is stable even if the internal model changes.

---

## 3. Inheritance

> **Definition:** A mechanism where a class (child) inherits fields, properties, and
> methods from another class (parent), enabling code reuse and establishing class hierarchies.

### 3.1 Controller Inheritance from `ControllerBase`

Every controller in the project inherits from `ControllerBase`, which is a built-in
ASP.NET Core class.

```csharp
// All controllers inherit from ControllerBase
public class AuthController    : ControllerBase { ... }
public class AdminController   : ControllerBase { ... }
public class BusController     : ControllerBase { ... }
public class BookingController : ControllerBase { ... }
public class OperatorController: ControllerBase { ... }
public class TripController    : ControllerBase { ... }
public class RouteController   : ControllerBase { ... }
public class PaymentController : ControllerBase { ... }
public class SeatController    : ControllerBase { ... }
```

By inheriting from `ControllerBase`, every controller automatically gains:

| Inherited Method | What it does |
|---|---|
| `Ok(result)` | Returns HTTP 200 with a response body |
| `BadRequest(error)` | Returns HTTP 400 |
| `NotFound(error)` | Returns HTTP 404 |
| `StatusCode(403, error)` | Returns custom HTTP status codes |
| `User` property | Gives access to the authenticated user's JWT claims |

**Example from `AdminController.cs`:**
```csharp
// These methods are all INHERITED from ControllerBase:
return Ok(new { message = "Operator approved" });
return NotFound(new { error = "Operator not found" });
return StatusCode(403, new { error = "Invalid administrator password." });

// The 'User' property (also inherited) reads JWT claims:
var adminEmail = User.FindFirst(ClaimTypes.Email)?.Value;
```

### 3.2 DbContext Inheritance

**File:** `Data/AppDbContext.cs`
```csharp
// AppDbContext inherits ALL database management capabilities from EF Core's DbContext
public class AppDbContext : DbContext
{
    // Inherited constructor pattern
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // DbSet properties (inherited capability to query/save any model)
    public DbSet<User> Users => Set<User>();
    public DbSet<Bus> Buses => Set<Bus>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Payment> Payments => Set<Payment>();
    ...
}
```

By inheriting from `DbContext`, `AppDbContext` automatically gains:
- `SaveChangesAsync()` — persists all tracked changes to the database.
- `Set<T>()` — creates a queryable DbSet for any model type.
- Change tracking, lazy/eager loading, and migration support.

### 3.3 BackgroundService Inheritance

**File:** `BackgroundServices/SeatUnlockJob.cs`
```csharp
// Inherits from .NET's built-in BackgroundService class
public class SeatUnlockJob : BackgroundService
{
    // Overrides the single abstract method required by the parent class
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            // Every 60 seconds: release expired seat locks and mark old trips as completed
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            ...
        }
    }
}
```

`BackgroundService` provides the lifecycle management (start, stop, cancellation).
`SeatUnlockJob` only needs to implement the business logic inside `ExecuteAsync`.

---

## 4. Polymorphism

> **Definition:** The ability of different objects to respond to the same interface or
> method call in different ways. In C#, this is achieved through method overriding
> and interface implementation.

### 4.1 Runtime Polymorphism via Interface Implementation

The most powerful form of polymorphism in this project is through **Dependency Injection**.

In `Program.cs`, the DI container is configured like this:
```csharp
builder.Services.AddScoped<IAuthService,    AuthService>();
builder.Services.AddScoped<IBusService,     BusService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IRouteService,   RouteService>();
builder.Services.AddScoped<IEmailService,   EmailService>();
builder.Services.AddHostedService<SeatUnlockJob>();
```

This means:
- `AuthController` asks for an `IAuthService` → at runtime, it receives an `AuthService`.
- `AdminController` asks for an `IEmailService` → at runtime, it receives an `EmailService`.

If we ever want to swap `EmailService` with a `MockEmailService` for testing, or a
`SendGridEmailService` for production, we change only **one line** in `Program.cs`.
No controller or other service code changes at all. That is the power of
**interface-based polymorphism**.

### 4.2 Method Overriding — `OnModelCreating`

**File:** `Data/AppDbContext.cs`
```csharp
public class AppDbContext : DbContext
{
    // Overrides the parent DbContext's virtual method to customize database schema
    protected override void OnModelCreating(ModelBuilder mb)
    {
        base.OnModelCreating(mb);  // Calls the parent's version first

        // Then adds project-specific configuration
        mb.Entity<User>().HasIndex(u => u.Email).IsUnique();
        mb.Entity<Bus>().HasIndex(b => b.BusNumber).IsUnique();
        mb.Entity<Booking>().HasIndex(b => b.BookingRef).IsUnique();

        mb.Entity<TripSeatStatus>()
            .HasIndex(t => new { t.TripId, t.SeatId })
            .IsUnique();   // Composite key — ensures no duplicate seat per trip

        mb.Entity<Payment>()
            .HasOne(p => p.Booking)
            .WithOne(b => b.Payment)
            .HasForeignKey<Payment>(p => p.BookingId); // One-to-one relationship
    }
}
```

The base `DbContext.OnModelCreating` does nothing by default. By overriding it,
`AppDbContext` customizes the entire database schema without changing the parent class.

### 4.3 Method Overriding — `ExecuteAsync` in BackgroundService

**File:** `BackgroundServices/SeatUnlockJob.cs`
```csharp
protected override async Task ExecuteAsync(CancellationToken stoppingToken)
{
    while (!stoppingToken.IsCancellationRequested)
    {
        // Release expired seat locks
        var expired = await db.TripSeatStatuses
            .Where(s => s.Status == "locked" && s.LockedUntil < DateTime.UtcNow)
            .ToListAsync();

        foreach (var s in expired)
        {
            s.Status = "available";
            s.LockedBy = null;
            s.LockedUntil = null;
        }

        // Mark past trips as completed
        var pastTrips = await db.Trips
            .Where(t => t.Status == "scheduled" && t.ArrivalTime < DateTime.UtcNow)
            .ToListAsync();

        foreach (var t in pastTrips)
            t.Status = "completed";
    }
}
```

### 4.4 Polymorphic Service Composition (BusService using IEmailService)

**File:** `Services/BusService.cs`
```csharp
public class BusService : IBusService
{
    private readonly IEmailService _emailService; // Depends on the INTERFACE

    public async Task<BusResponseDto> ToggleBusStatusAsync(int id, int operatorId)
    {
        ...
        if (!bus.IsActive) // Bus was just blocked
        {
            foreach (var booking in bookingsToNotify)
            {
                // Which email service is used? Decided at runtime by DI!
                await _emailService.SendBusBlockedNotificationAsync(booking);
            }
        }
    }
}
```

---

## 5. Additional OOP Concepts Applied

### 5.1 Composition Over Inheritance (Object Relationships)

Instead of creating one giant class, real-world entities are composed of smaller
related objects connected through **navigation properties**.

```
User  ──< Bus  ──< Seat
 │                  │
 └──< Booking ──< BookingPassenger
          │
          └── Payment
          └── Trip ──< TripSeatStatus
                 └── Route ──< BoardingPoint
```

**Example:** A `Booking` is composed of a `User`, a `Trip`, many `BookingPassenger`s,
and one optional `Payment`. No inheritance is needed — composition handles it.

```csharp
public class Booking
{
    public User User { get; set; } = null!;
    public Trip Trip { get; set; } = null!;
    public ICollection<BookingPassenger> Passengers { get; set; } = new List<BookingPassenger>();
    public Payment? Payment { get; set; }  // Optional composition
}
```

### 5.2 Single Responsibility Principle (SRP)

Each class has one job:

| Class | Single Responsibility |
|---|---|
| `AuthService` | User registration, login, and profile management |
| `BusService` | CRUD for buses and seat layout management |
| `BookingService` | Creating, cancelling, and querying bookings |
| `TripService` | Scheduling and managing trips |
| `EmailService` | Sending all email notifications |
| `SeatUnlockJob` | Background job to release expired seat locks |
| `AppDbContext` | Database schema definition and EF Core setup |
| `JwtHelper` | JWT token generation only |

### 5.3 Dependency Inversion Principle (DIP)

High-level modules (controllers) do not depend on low-level modules (services directly).
Both depend on abstractions (interfaces).

```
AdminController
    ↓ depends on
IEmailService  (interface)
    ↑ implemented by
EmailService   (concrete class)
```

---

## 6. Architecture Diagram

```
┌──────────────────────────────────────────────────────┐
│                   CLIENT (Angular)                   │
└───────────────────────┬──────────────────────────────┘
                        │ HTTP Requests
┌───────────────────────▼──────────────────────────────┐
│               CONTROLLERS (Layer 1)                  │
│  AuthController, AdminController, BusController...   │
│  → Inherits from ControllerBase (Inheritance)        │
│  → Depends on Interfaces (Abstraction + DIP)         │
└───────────────────────┬──────────────────────────────┘
                        │ calls
┌───────────────────────▼──────────────────────────────┐
│               INTERFACES (Contracts)                 │
│  IAuthService, IBusService, IBookingService...       │
│  → Pure Abstraction (what, not how)                  │
└───────────────────────┬──────────────────────────────┘
                        │ implemented by
┌───────────────────────▼──────────────────────────────┐
│               SERVICES (Layer 2)                     │
│  AuthService, BusService, BookingService...          │
│  → Implements Interfaces (Polymorphism)              │
│  → Private fields (Encapsulation)                    │
│  → Private helper methods (Encapsulation)            │
└───────────────────────┬──────────────────────────────┘
                        │ reads/writes
┌───────────────────────▼──────────────────────────────┐
│               DATA LAYER (Layer 3)                   │
│  AppDbContext → DbContext (Inheritance + Override)   │
│  Models: User, Bus, Trip, Booking, Seat...           │
│  → Properties with getters/setters (Encapsulation)  │
│  → Navigation Properties (Composition)               │
└───────────────────────┬──────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│            DATABASE (SQLite / SQL Server)             │
└──────────────────────────────────────────────────────┘

             ┌─────────────────────────────┐
             │    BACKGROUND SERVICES      │
             │  SeatUnlockJob              │
             │  → Inherits BackgroundService│
             │  → Overrides ExecuteAsync   │
             └─────────────────────────────┘
```

---

## 7. Summary Table

| OOP Concept | Where Applied | Specific File | Benefit |
|---|---|---|---|
| **Encapsulation** | Model properties | `Models/User.cs`, `Bus.cs`, `Trip.cs` | Prevents invalid state; hides password hash |
| **Encapsulation** | Private service fields | `Services/AuthService.cs`, `BusService.cs` | Hides DB and JWT internals from controllers |
| **Encapsulation** | Private helper methods | `Services/BusService.cs` | Hides seat-label generation algorithm |
| **Encapsulation** | Private audit log method | `Controllers/AdminController.cs` | Hides audit logging from HTTP clients |
| **Abstraction** | Interfaces | `Interfaces/IAuthService.cs`, `IBusService.cs` | Decouples controllers from service logic |
| **Abstraction** | DTOs | `DTOs/Auth/`, `DTOs/Bus/` | Hides internal models from external API |
| **Inheritance** | Controller base | All 9 controllers → `ControllerBase` | Reuses `Ok()`, `NotFound()`, `User` claims |
| **Inheritance** | DB context | `AppDbContext` → `DbContext` | Reuses EF Core DB management capabilities |
| **Inheritance** | Background job | `SeatUnlockJob` → `BackgroundService` | Reuses lifecycle management infrastructure |
| **Polymorphism** | Interface implementation | `AuthService : IAuthService` | Swappable at runtime via DI |
| **Polymorphism** | Method override | `AppDbContext.OnModelCreating` | Customizes schema without changing parent |
| **Polymorphism** | Method override | `SeatUnlockJob.ExecuteAsync` | Provides custom background logic |
| **Polymorphism** | DI-based runtime swap | `IEmailService` in `BusService` | Swap email provider without code changes |
| **Composition** | Navigation properties | `Booking`, `Bus`, `Trip` models | Models real-world "has-a" relationships |
