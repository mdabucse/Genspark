# PostgreSQL Integration

## Step 1 - Install PostgreSQL Package

Inside DAL project:

```bash
dotnet add package Npgsql
```

---

## Step 2 - Create Database

```sql
CREATE DATABASE notificationdb;
```

---

## Step 3 - Create Accounts Table

```sql
CREATE TABLE accounts
(
    accountnumber VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100),
    balance REAL,
    createddate TIMESTAMP
);
```

---

## Step 4 - Create Notifications Table

```sql
CREATE TABLE notifications
(
    id SERIAL PRIMARY KEY,

    accountnumber VARCHAR(50),

    username VARCHAR(100),

    message TEXT,

    notificationtype VARCHAR(50),

    sentdate TIMESTAMP,

    CONSTRAINT fk_account
    FOREIGN KEY(accountnumber)
    REFERENCES accounts(accountnumber)
);
```

---

# Database Relationship

Created One-To-Many relationship.

```text
accounts
    |
    | 1
    |
    ------< notifications
              many
```

One account can have multiple notifications.

---

# Database Connection Setup

Created PostgreSQL connection string.

```csharp
string connectionstring =
"Host=localhost;Port=5432;Database=notificationdb;Username=postgres;Password=yourpassword";
```

Created connection object:

```csharp
NpgsqlConnection connection;
```

Initialized inside constructor:

```csharp
connection = new NpgsqlConnection(connectionstring);
```

---

# Account Repository Implementation

Implemented:

- Create Account
- Read Account
- Update Account
- Delete Account
- Get Last Account Number

---

# Automatic Account Number Generation

Created function:

```csharp
getLastAccountNumber()
```

SQL query used:

```sql
SELECT accountnumber
FROM accounts
ORDER BY accountnumber DESC
LIMIT 1;
```

Logic:

1. Fetch latest account number
2. Convert to long
3. Increment by 1
4. Assign to new account

Example:

```text
9990001000
9990001001
9990001002
```

---

# SQL Operations Used

## INSERT / UPDATE / DELETE

Used:

```csharp
ExecuteNonQuery()
```

---

## Read Single Value

Used:

```csharp
ExecuteScalar()
```

For:

```text
Fetching latest account number
```

---

## Read Multiple Rows

Used:

```csharp
ExecuteReader()
```

For:

```text
Fetching account details
Fetching notification details
```

---

# Parameterized Queries

Used parameterized queries to prevent SQL Injection.

Example:

```csharp
command.Parameters.AddWithValue(
    "@accountnumber",
    value.AccountNumber
);
```

---

# Notification Repository

Implemented:

- Save Notification
- Get All Notifications

---

# Notification Storage

Notifications stored in PostgreSQL instead of in-memory collections.

Previously:

```csharp
List<Notification>
```

Updated to:

```text
PostgreSQL Database Storage
```

---

# Notification Flow

## Step 1

Create Account

User enters:

- Username
- Email
- Phone Number
- Initial Balance

---

## Step 2

Account stored in PostgreSQL.

Account number generated automatically.

---

## Step 3

Send Notification

User enters:

- Account Number
- Notification Type
- Message

---

## Step 4

System fetches account details from database.

---

## Step 5

Business layer validates:

- Message not empty
- Minimum length
- Email validation
- Phone validation
- SMS character limit

---

## Step 6

Notification sent using polymorphism.

```text
EmailNotification
SmsNotification
```

---

## Step 7

Notification stored in PostgreSQL database.

---

# Architecture Improvements Done

## Removed In-Memory Dictionary Storage

Initially:

```csharp
Dictionary<string, Account>
```

was used.

After PostgreSQL integration, dictionary storage was removed to avoid duplicate data handling.

---

# Final Architecture

```text
Presentation Layer
        |
        v
Business Logic Layer
        |
        v
Data Access Layer
        |
        v
PostgreSQL Database
```


# Commands Used

## Build Project

```bash
dotnet build
```

---

## Run Project

```bash
dotnet run
```

---

## Install PostgreSQL Package

```bash
dotnet add package Npgsql
```