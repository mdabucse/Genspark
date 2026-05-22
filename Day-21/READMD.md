# JWT Authentication Concepts 

# Introduction

JWT (JSON Web Token) is a secure and stateless authentication mechanism used in modern web applications and APIs.

JWT is mainly used for:

- Authentication
- Authorization
- Secure API Communication
- Stateless Session Management

---

# What is JWT

JWT stands for:

```text
JSON Web Token
```

JWT is a digitally signed token used to securely transfer user identity information between client and server.

---

# Why JWT is Used

JWT solves the problem of:

```text
How to securely identify users without storing session data on server.
```

Benefits:

- Stateless Authentication
- Faster API Communication
- Works well in Microservices
- Scalable
- Secure

---

# Stateless Authentication

Traditional Session Authentication:

```text
Server stores session in memory/database
```

JWT Authentication:

```text
Server stores nothing
```

All user identity information is stored inside token itself.

---

# JWT Structure

JWT consists of 3 parts:

```text
HEADER.PAYLOAD.SIGNATURE
```

Example:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJuYW1lIjoiQWJ1YmFra2FyIiwicm9sZSI6IkFkbWluIn0.
abcxyz123
```

---

# 1. Header

Header contains metadata about token.

Example:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

## Header Fields

| Field | Meaning |
|---|---|
| alg | Algorithm used for signing |
| typ | Token type |

---

# 2. Payload

Payload contains claims.

Claims are user-related information.

Example:

```json
{
  "name": "abubakkar",
  "role": "Admin"
}
```

---

# Claims

Claims are identity information stored inside JWT.

## Types of Claims

### Registered Claims

| Claim | Meaning |
|---|---|
| sub | Subject |
| iss | Issuer |
| exp | Expiration |
| aud | Audience |
| iat | Issued At |

### Public Claims

Custom shared claims.

### Private Claims

Application-specific claims.

---

# Important JWT Security Concept

JWT payload is:

```text
Encoded
```

NOT:

```text
Encrypted
```

Anyone can decode JWT payload.

Never store:

- Passwords
- Sensitive Information
- Bank Details

inside JWT payload.

---

# 3. Signature

Signature is the security component of JWT.

Purpose:

- Prevent token tampering
- Verify token authenticity

---

# JWT Signature Formula

```text
HMACSHA256(
    Header + Payload,
    SecretKey
)
```

Signature depends on:

- Header
- Payload
- Secret Key
- Algorithm

---

# Secret Key

Secret Key is the most important security component.

Purpose:

- Generate Signature
- Validate Signature

Example:

```csharp
var key = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(_key)
);
```

---

# SymmetricSecurityKey

Symmetric means:

```text
Same key used for:
1. Signing
2. Validation
```

---

# SigningCredentials

Used to define:

- Which key to use
- Which algorithm to use

Example:

```csharp
var credentials = new SigningCredentials(
    key,
    SecurityAlgorithms.HmacSha256
);
```

---

# HmacSha256

Represents:

```text
HS256 Algorithm
```

Used for JWT signature generation.

---

# JWT Creation Process

## Step 1

User sends:

```json
{
   "username":"abu",
   "password":"123"
}
```

to server.

---

# Step 2

Server validates user credentials.

---

# Step 3

Server creates claims.

Example:

```csharp
var claims = new[]
{
    new Claim(ClaimTypes.Name, request.Username),
    new Claim(ClaimTypes.Role, request.Role)
};
```

---

# Step 4

Server prepares Secret Key.

Example:

```csharp
var key = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(_key)
);
```

---

# Step 5

Server creates Signing Credentials.

Example:

```csharp
var credentials = new SigningCredentials(
    key,
    SecurityAlgorithms.HmacSha256
);
```

---

# Step 6

Server creates JWT Token.

Example:

```csharp
var token = new JwtSecurityToken(
    issuer: _issuer,
    claims: claims,
    expires: DateTime.UtcNow.AddMinutes(60),
    signingCredentials: credentials
);
```

---

# Step 7

Server converts JWT object into token string.

Example:

```csharp
return new JwtSecurityTokenHandler()
    .WriteToken(token);
```

---

# Final JWT Generated

```text
HEADER.PAYLOAD.SIGNATURE
```

---

# JWT Validation Process

When client sends token back:

```http
Authorization: Bearer TOKEN
```

server validates JWT.

---

# JWT Validation Steps

## Step 1

Extract:

- Header
- Payload
- Signature

from token.

---

# Step 2

Server recalculates signature using:

```text
Header + Payload + SecretKey
```

---

# Step 3

Compare:

```text
Recalculated Signature
VS
Token Signature
```

---

# Step 4

If signatures match:

```text
Token Valid
```

Else:

```text
Token Invalid
```

---

# Authentication vs Authorization

| Authentication | Authorization |
|---|---|
| Who are you? | What can you access? |

---

# Authentication

Verifies user identity.

Example:

```text
Username + Password Validation
```

---

# Authorization

Checks access permissions.

Example:

```text
Can user access protected API?
```

---

# [Authorize] Attribute

Used to protect endpoints.

Example:

```csharp
[Authorize]
public IActionResult GetData()
```

Only authenticated users can access.

---

# Role-Based Authorization

Example:

```csharp
[Authorize(Roles = "Admin")]
```

Only Admin users can access.

---

# ASP.NET Core JWT Setup

# Step 1

Install Package:

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

---

# Step 2

Add JWT Configuration in appsettings.json

```json
{
  "JWT": {
    "Key": "SecretKey",
    "Issuer": "Presidio",
    "DurationInMinutes": "60"
  }
}
```

---

# Step 3

Register Authentication

```csharp
builder.Services.AddAuthentication()
```

---

# Step 4

Configure JWT Validation

```csharp
.AddJwtBearer(opts =>
{
    opts.TokenValidationParameters =
        new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true
        };
});
```

---

# Step 5

Register Authorization

```csharp
builder.Services.AddAuthorization();
```

---

# Step 6

Enable Middleware

```csharp
app.UseAuthentication();
app.UseAuthorization();
```

---

# Step 7

Protect Endpoints

Example:

```csharp
[Authorize]
[HttpGet]
public IActionResult GetData()
```

---

# Complete JWT Flow

```text
User Login
      ↓
Validate Credentials
      ↓
Create Claims
      ↓
Prepare Secret Key
      ↓
Generate Signature
      ↓
Create JWT
      ↓
Send JWT to Client
      ↓
Client Stores JWT
      ↓
Client Sends JWT in Requests
      ↓
Server Validates JWT
      ↓
Authorization Applied
      ↓
Access Granted
```

---

# How We Used JWT in Our Project

## 1. Created TokenService

Purpose:

- Generate JWT
- Create Claims
- Generate Signature

---

# 2. Used IConfiguration

Read values from:

```json
appsettings.json
```

---

# 3. Created Claims

Example:

```csharp
new Claim(ClaimTypes.Name, request.Username)
```

---

# 4. Used Secret Key

Example:

```csharp
new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(_key)
)
```

---

# 5. Used Signing Credentials

Example:

```csharp
new SigningCredentials(
    key,
    SecurityAlgorithms.HmacSha256
)
```

---

# 6. Created JWT Token

Example:

```csharp
new JwtSecurityToken(...)
```

---

# 7. Configured JWT Authentication

Used:

```csharp
builder.Services.AddAuthentication()
```

---

# 8. Enabled Middleware

Used:

```csharp
app.UseAuthentication();
app.UseAuthorization();
```

---

# 9. Protected APIs

Used:

```csharp
[Authorize]
```

---

# Important Security Best Practices

## Never Store Password in JWT

Wrong:

```csharp
new Claim("Password", request.Password)
```

---

# Use UTC Time

Correct:

```csharp
DateTime.UtcNow
```

---

# Keep Secret Key Secure

Never expose Secret Key publicly.

---

# Use HTTPS

JWT should always travel through HTTPS.

---

# Use Expiration Time

Always set token expiration.

---

# Final Understanding

JWT Authentication works using:

- Claims
- Secret Key
- Digital Signature
- Middleware
- Authorization Attributes

Server validates JWT by:

1. Extracting Header and Payload
2. Recalculating Signature
3. Comparing Signatures
4. Allowing Access if Valid

JWT security depends on:

```text
SECRET KEY + SIGNATURE VALIDATION
```