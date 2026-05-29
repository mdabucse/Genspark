# Security & API Protection

## 1. Auth0

### What is Auth0?

Auth0 is an Authentication and Authorization platform that helps applications securely manage user identities and access control.

### Key Concepts

* Authentication: Verifies who the user is.
* Authorization: Determines what the user can access.
* JWT (JSON Web Token)
* OAuth 2.0
* OpenID Connect (OIDC)
* Access Tokens
* Refresh Tokens
* Role-Based Access Control (RBAC)

### Auth0 Components

* Tenant
* Domain
* API
* Applications
* Users
* Roles
* Permissions

### Auth0 API Setup

1. Create an API in Auth0 Dashboard.
2. Configure:

   * Name
   * Identifier (Audience)
   * Signing Algorithm (RS256)
3. Copy:

   * Domain
   * Audience (Identifier)
4. Configure ASP.NET Core application.

### Domain

Example:

```text
dev-abc123.us.auth0.com
```

Used as the token issuer.

### Audience (Identifier)

Example:

```text
https://api.hackverse.com
```

Used to identify the target API.

### RS256

Uses:

* Private Key for signing
* Public Key for validation

Benefits:

* More secure
* Industry standard
* Recommended by Auth0

---

## 2. Public vs Private Endpoints

### Public Endpoint

```csharp
app.MapGet("/api/public", () =>
{
    return "Public Endpoint";
});
```

Characteristics:

* No authentication required.
* Accessible by anyone.

### Private Endpoint

```csharp
app.MapGet("/api/private", () =>
{
    return "Private Endpoint";
})
.RequireAuthorization();
```

Characteristics:

* Requires authentication.
* Requires a valid JWT token.

---

## 3. Authentication Flow

```text
User
  |
  v
Auth0 Login
  |
  v
JWT Token
  |
  v
API
  |
  v
Protected Resource
```

### Without Token

```text
Client
  |
  v
/api/private
  |
  v
401 Unauthorized
```

### With Token

```text
Client
  |
Bearer Token
  |
  v
API
  |
Validate JWT
  |
  v
200 OK
```

---

## 4. Accessing Private Endpoints

### Create Machine-to-Machine Application

Auth0 Dashboard:

```text
Applications
    →
Applications
    →
Create Application
```

Choose:

* Machine to Machine Application

### Authorize API

Select the API and authorize it.

### Generate Access Token

```http
POST https://YOUR_DOMAIN/oauth/token
```

Request Body:

```json
{
  "client_id": "CLIENT_ID",
  "client_secret": "CLIENT_SECRET",
  "audience": "https://api.hackverse.com",
  "grant_type": "client_credentials"
}
```

### Call Protected Endpoint

```http
GET /api/private
Authorization: Bearer ACCESS_TOKEN
```

---

## 5. Mappers in C#

### Purpose

Convert one object into another object.

### Common Mapping Scenarios

* Entity → DTO
* DTO → Entity

### Example

```csharp
public static class UserMapper
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name
        };
    }
}
```

Usage:

```csharp
var dto = user.ToDto();
```

### Benefits

* Separation of concerns
* Cleaner controllers
* Reusable conversion logic
* Better API security

### Mapper Types

1. Manual Mapper
2. Extension Method Mapper
3. AutoMapper Library

---

## 6. Throttling

### Definition

A technique used to control the number of requests processed by an application.

### Purpose

* Prevent abuse
* Protect resources
* Improve stability
* Reduce server overload

### Example

```text
5 Requests / Minute
```

Request 6:

```http
429 Too Many Requests
```

### Common Use Cases

* Login APIs
* OTP APIs
* Search APIs
* Public APIs

---

## 7. Rate Limiting

### Definition

Restricts the number of requests allowed within a specific period.

### Example

```text
100 Requests / Minute
```

Request 101:

```http
429 Too Many Requests
```

### ASP.NET Core Rate Limiting

```csharp
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter(
        "fixed",
        opt =>
        {
            opt.PermitLimit = 5;
            opt.Window = TimeSpan.FromMinutes(1);
        });
});
```

### Applying Rate Limiting

```csharp
app.MapGet("/api/test", () =>
{
    return "Hello";
})
.RequireRateLimiting("fixed");
```

---

## 8. Rate Limiting Algorithms

### Fixed Window

```text
100 Requests
Per Minute
```

Counter resets after each window.

### Sliding Window

```text
Checks the previous 60 seconds continuously.
```

More accurate than Fixed Window.

### Token Bucket

```text
Bucket contains tokens.
Each request consumes a token.
Tokens refill periodically.
```

Used in cloud APIs.

### Concurrency Limiter

```text
Limits simultaneous requests.
```

Useful for expensive operations.

---

## 9. Difference Between Rate Limiting and Throttling

### Rate Limiting

Defines the request quota.

Example:

```text
100 Requests / Minute
```

### Throttling

Enforces the quota.

Example:

```http
429 Too Many Requests
```

In modern systems, both terms are often used interchangeably.

---

## Key Interview Definitions

### Auth0

A cloud-based Authentication and Authorization platform that manages user identities, authentication, and secure access to APIs and applications.

### JWT

A compact, secure token used to transfer user identity and authorization information between parties.

### Mapper

A component that converts one object type into another, commonly used between Entities and DTOs.

### Throttling

A mechanism that controls and restricts incoming request rates to protect application resources.

### Rate Limiting

A technique that defines and enforces the maximum number of requests allowed within a specific period.

### Public Endpoint

An API endpoint that does not require authentication.

### Private Endpoint

An API endpoint that requires authentication and authorization before access is granted.
