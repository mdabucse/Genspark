# Word Guessing Game with Database Integration and Separation of Concerns

# Project Overview

This project is a console-based Word Guessing Game developed using C#, Object-Oriented Programming (OOP), ADO.NET, PostgreSQL, and Layered Architecture principles.

The application was initially developed as a single console application and later refactored into a multi-project layered architecture to implement proper Separation of Concerns (SoC).

The project includes:
- User Authentication
- Database Connectivity
- Persistent Score Storage
- Past Game History
- Difficulty Levels
- Custom Exception Handling
- Random Word Generation from Database

---

# Objectives of Refactoring

The original application contained all logic inside a single project.

The project was later converted into a layered architecture to:
- improve maintainability
- separate responsibilities
- make the application scalable
- implement database-driven design
- follow enterprise application practices

---

# Final Architecture

```text
GameWithDb.sln
│
├── GameWithDb.FE
├── GameWithDb.BLL
├── GameWithDb.DAL
├── GameWithDb.Models
├── GameWithDb.Exceptions
```

---

# Layer Responsibilities

# 1. GameWithDb.FE (Frontend Layer)

## Responsibility

Handles:
- Console UI
- User interaction
- Menus
- Game flow
- Replay options

## Files

```text
Program.cs
GameEngine.cs
```

## Responsibilities Implemented

- Register/Login menu
- Main menu system
- Starting game
- Viewing past games
- Displaying scores
- Console interactions

---

# 2. GameWithDb.BLL (Business Logic Layer)

## Responsibility

Contains all business rules and application logic.

This layer:
- validates data
- controls application behavior
- coordinates repositories

## Files

```text
AuthenticationService.cs
GuessValidator.cs
FeedbackGenerator.cs
```

## Responsibilities Implemented

### AuthenticationService
- User registration validation
- Login validation
- Communication between FE and DAL

### GuessValidator
- Empty input validation
- Word length validation
- Number validation
- Special character validation

### FeedbackGenerator
- Generates:
  - G → correct letter and position
  - Y → correct letter wrong position
  - X → letter not found

---

# 3. GameWithDb.DAL (Data Access Layer)

## Responsibility

Handles all database operations.

This layer:
- connects PostgreSQL
- executes SQL queries
- fetches and stores data

## Files

```text
DbConnectionFactory.cs
WordProvider.cs
UserRepository.cs
ScoreRepository.cs
```

---

## DbConnectionFactory.cs

### Purpose

Centralized database connection handling.

### Responsibilities

- Stores PostgreSQL connection string
- Creates `NpgsqlConnection`
- Opens database connection

### Key Concept

```csharp
using var connection
```

Used for:
- automatic resource cleanup
- preventing connection leaks

---

## WordProvider.cs

### Purpose

Fetch random hidden word from database.

### Query Used

```sql
SELECT word
FROM words
ORDER BY RANDOM()
LIMIT 1;
```

### Responsibilities

- Execute SQL query
- Read data using `NpgsqlDataReader`
- Return random word

---

## UserRepository.cs

### Purpose

Handles user authentication operations.

### Responsibilities

- Register users
- Login users
- Fetch authenticated user

### Queries Used

#### Register User

```sql
INSERT INTO users(username, password)
VALUES(@username, @password);
```

#### Login User

```sql
SELECT *
FROM users
WHERE username = @username
AND password = @password;
```

### Important Concept

Parameterized Queries

```csharp
command.Parameters.AddWithValue()
```

Used to:
- prevent SQL Injection
- safely pass user inputs

---

## ScoreRepository.cs

### Purpose

Handles score persistence and history retrieval.

### Responsibilities

- Save scores
- Fetch past game history

### Queries Used

#### Save Score

```sql
INSERT INTO scores(user_id, score, difficulty)
VALUES(@userid, @score, @difficulty);
```

#### Fetch Past Games

```sql
SELECT *
FROM scores
WHERE user_id = @userid
ORDER BY played_at DESC;
```

---

# 4. GameWithDb.Models (Model Layer)

## Responsibility

Stores application data structures.

This layer contains only:
- properties
- constructors
- state objects

No:
- SQL
- validation
- business logic

## Files

```text
User.cs
Score.cs
GameState.cs
DifficultyLevel.cs
```

---

## User.cs

Represents:
```text
users table
```

### Properties

- Id
- Username
- Password

---

## Score.cs

Represents:
```text
scores table
```

### Properties

- Id
- UserId
- ScoreValue
- Difficulty
- PlayedAt

---

## GameState.cs

Stores:
- Hidden word
- Current attempt
- Max attempts
- Score
- Difficulty
- Game status
- Visited words

---

## DifficultyLevel.cs

Implemented using Enum.

### Difficulty Modes

| Difficulty | Attempts |
|---|---|
| Easy | 8 |
| Medium | 6 |
| Hard | 4 |

---

# 5. GameWithDb.Exceptions (Exception Layer)

## Responsibility

Contains custom exceptions.

## Files

```text
InvalidGuessException.cs
```

### Purpose

Provides meaningful error messages for invalid guesses.

### Example

```text
Guess must contain only letters.
```

---

# Database Design

# Database Used

```text
PostgreSQL
```

---

# Database Creation

```sql
CREATE DATABASE gamewithdb;
```

---

# Tables

# users

```sql
CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);
```

---

# words

```sql
CREATE TABLE words
(
    id SERIAL PRIMARY KEY,
    word VARCHAR(5) NOT NULL
);
```

---

# scores

```sql
CREATE TABLE scores
(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    score INT,
    difficulty VARCHAR(20),
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# Sample Words Inserted

```sql
INSERT INTO words(word)
VALUES
('APPLE'),
('MANGO'),
('GRAPE'),
('TRAIN'),
('PLANT'),
('BRAIN');
```

---

# Database Connectivity

# Package Installed

```bash
dotnet add package Npgsql
```

---

# ADO.NET Concepts Used

| Concept | Purpose |
|---|---|
| NpgsqlConnection | Database connection |
| NpgsqlCommand | Execute SQL query |
| NpgsqlDataReader | Read data |
| ExecuteReader() | Fetch records |
| ExecuteNonQuery() | INSERT/UPDATE/DELETE |

---

# Resource Management

Implemented using:

```csharp
using var connection
```

Purpose:
- automatic cleanup
- prevent connection leaks
- safely dispose unmanaged resources

---

# Authentication Flow

```text
Application Start
        ↓
Register/Login
        ↓
AuthenticationService
        ↓
UserRepository
        ↓
PostgreSQL
```

---

# Game Flow

```text
Login Successful
        ↓
Main Menu
        ↓
Start Game
        ↓
Generate Word From DB
        ↓
Validate Guess
        ↓
Generate Feedback
        ↓
Calculate Score
        ↓
Save Score To DB
```

---

# Past Game History Flow

```text
View Past Games
        ↓
ScoreRepository
        ↓
Fetch User Scores
        ↓
Display Game History
```

---

# Score Calculation

| Attempt | Score |
|---|---|
| 1 | 100 |
| 2 | 80 |
| 3 | 60 |
| 4 | 40 |
| 5 | 20 |
| 6 | 10 |

---

# Concepts Covered

# C# Concepts

- Classes and Objects
- Encapsulation
- Constructors
- Properties
- Methods
- Enums
- Collections
- HashSet
- Loops
- Conditional Statements
- String Handling
- StringBuilder
- Exception Handling
- Custom Exceptions

---

# Architecture Concepts

- Layered Architecture
- Separation of Concerns
- Repository Pattern
- Business Logic Layer
- Data Access Layer
- Frontend Layer
- Model Layer

---

# Database Concepts

- PostgreSQL
- ADO.NET
- Npgsql
- SQL Queries
- Parameterized Queries
- ExecuteReader
- ExecuteNonQuery
- Data Persistence

---

# Important Learnings

# Separation of Concerns

Each layer handles only its own responsibility.

| Layer | Responsibility |
|---|---|
| FE | UI and Interaction |
| BLL | Business Logic |
| DAL | Database Operations |
| Models | Data Structures |
| Exceptions | Error Definitions |

---

# Why Layered Architecture?

Benefits:
- scalable
- maintainable
- reusable
- easier debugging
- enterprise-ready structure

---

# Key Learning Outcome

This project helped in understanding:
- enterprise application structure
- database-driven architecture
- ADO.NET integration
- layered application design
- proper separation of concerns
- persistent applications using PostgreSQL