# Exception Handling and Word Guessing Game

## Overview

This repository contains the concepts, implementations, and practical understanding gained while building a console-based Word Guessing Game using C# and Object-Oriented Programming principles.

The project was developed step-by-step while learning:
- Exception Handling
- Custom Exceptions
- OOP Concepts
- Collections
- String Handling
- Console Applications
- Game State Management
- Clean Architecture Principles

---

# Topics Covered

# 1. Exception Handling

## Definition

Exception Handling is a mechanism used to handle runtime errors without crashing the application.

It allows the program to:
- detect errors
- handle errors gracefully
- continue execution safely

---

## Basic Structure

```csharp
try
{
    // risky code
}
catch(Exception ex)
{
    // handle error
}
finally
{
    // cleanup code
}
```

---

## Important Understanding

Without exception handling:
- application crashes immediately

With exception handling:
- user gets meaningful messages
- application continues safely

---

## Common Exceptions Learned

| Exception | Meaning |
|---|---|
| FormatException | Invalid conversion |
| OverflowException | Value exceeds datatype range |
| DivideByZeroException | Division by zero |
| NullReferenceException | Accessing null object |

---

## Key Point

Exception handling is not only for debugging.

It is mainly used for:
- application stability
- user-friendly error handling
- safe execution flow

---

# 2. checked Keyword

## Definition

`checked` is used to detect arithmetic overflow during runtime.

---

## Example

```csharp
checked
{
    int value = int.MaxValue;
    value++;
}
```

Without `checked`:
- value wraps around

With `checked`:
- `OverflowException` is thrown

---

## Key Point

`checked` is mainly used for:
- arithmetic operations
- overflow protection

---

# 3. Custom Exceptions

## Definition

Custom exceptions are user-defined exception classes created for specific business rules.

---

## Example

```csharp
class InvalidGuessException : Exception
{
    public InvalidGuessException(string message)
        : base(message)
    {
    }
}
```

---

## Why Custom Exceptions?

Instead of generic messages:
```text
Something went wrong
```

Custom exceptions provide:
```text
Guess must contain only letters
```

---

## Key Point

Custom exceptions improve:
- readability
- maintainability
- separation of concerns

---

# 4. Separation of Concerns

## Definition

Each class should have only one responsibility.

---

## Example Architecture

| Class | Responsibility |
|---|---|
| WordProvider | Generate words |
| GuessValidator | Validate input |
| FeedbackGenerator | Generate feedback |
| GameEngine | Control game flow |

---

## Key Point

Good architecture means:
- smaller focused classes
- easier debugging
- better maintainability

---

# 5. Exception Propagation

## Definition

Exceptions can move from one layer to another until handled.

---

## Flow

```text
Service Layer
    ↓
GameEngine
    ↓
Program.cs
```

---

## Key Point

Exceptions should usually be:
- thrown in lower layers
- handled in controller/main layer

---

# 6. OOP Concepts

## Classes and Objects

### Definition

Classes define structure and behavior.

Objects are instances of classes.

---

## Example

```csharp
GameState user = new GameState();
```

---

# 7. Constructors

## Definition

Constructors initialize object state during object creation.

---

## Example

```csharp
public GameState()
{
    CurrentAttempt = 1;
}
```

---

## Key Point

Constructors help:
- initialize defaults
- prepare objects safely

---

# 8. Encapsulation

## Definition

Encapsulation means protecting and managing data using properties and methods.

---

## Example

```csharp
public string HiddenWord { get; set; }
```

---

## Key Point

Encapsulation improves:
- data safety
- cleaner code structure

---

# 9. Collections

## List

Used for storing multiple values.

### Example

```csharp
List<string> words
```

---

## HashSet

Used for unique values.

### Example

```csharp
HashSet<string> visitedWords
```

---

## Key Point

HashSet is ideal for:
- duplicate prevention
- fast lookup operations

---

# 10. String Handling

## Methods Learned

| Method | Purpose |
|---|---|
| Length | String length |
| Contains | Check substring |
| ToUpper | Convert uppercase |
| IsNullOrWhiteSpace | Empty validation |

---

## Character Validation

### Example

```csharp
char.IsLetter(c)
```

Used to validate:
- alphabets
- special characters
- numbers

---

## Key Point

Strings are iterable collections of characters.

---

# 11. Loops

## Loops Used

| Loop | Usage |
|---|---|
| while | Game loop |
| for | Feedback generation |
| foreach | Character iteration |

---

## Key Point

Loops help automate repetitive tasks.

---

# 12. Conditional Statements

## Statements Used

```csharp
if
else if
else
switch
```

---

## Key Point

Conditionals control application decision flow.

---

# 13. Random Class

## Definition

Used to generate random values.

---

## Example

```csharp
Random random = new Random();
```

---

## Usage

Used for:
- random hidden word generation

---

# 14. StringBuilder

## Definition

Efficient way to build strings dynamically.

---

## Example

```csharp
StringBuilder feedback = new StringBuilder();
```

---

## Key Point

Preferred over:
```csharp
string +=
```

for repeated string modifications.

---

# 15. Console.ForegroundColor

## Definition

Used to display colored console output.

---

## Example

```csharp
Console.ForegroundColor = ConsoleColor.Green;
```

---

## Usage

| Feedback | Color |
|---|---|
| G | Green |
| Y | Yellow |
| X | Red |

---

# 16. Replay Logic

## Definition

Allows restarting the game without restarting the application.

---

## Key Point

Replay logic should be handled:
- in Program.cs
- at application flow level

---

# 17. Difficulty Levels

## Difficulty Modes

| Level | Attempts |
|---|---|
| Easy | 8 |
| Medium | 6 |
| Hard | 4 |

---

## Enum Usage

```csharp
enum DifficultyLevel
```

---

## Key Point

Enums provide:
- cleaner code
- type safety
- readable constants

---

# 18. Score Calculation

## Logic

Fewer attempts result in higher score.

---

## Example

| Attempt | Score |
|---|---|
| 1 | 100 |
| 2 | 80 |
| 3 | 60 |

---

## Key Point

Score systems improve:
- user engagement
- replayability

---

# 19. NullReferenceException

## Definition

Occurs when accessing methods/properties on null objects.

---

## Example

```csharp
visitedWords.Contains()
```

when:
```csharp
visitedWords = null
```

---

## Key Point

Reference-type objects must be initialized before use.

---

# 20. Variable Shadowing

## Definition

Occurs when local variables hide class fields.

---

## Wrong Example

```csharp
HashSet<string> visitedWords =
    new HashSet<string>();
```

inside constructor creates:
- local variable
- not class field assignment

---

## Correct Example

```csharp
visitedWords = new HashSet<string>();
```

---

# Project Features Implemented

- Random hidden word generation
- Guess validation
- Feedback generation
- Duplicate guess prevention
- Difficulty levels
- Score calculation
- Replay option
- Colored console output
- Custom exception handling

---

# Final Outcome

This learning journey helped build practical understanding of:
- Object-Oriented Programming
- Exception Handling
- Console Application Development
- Architecture Design
- Collections and String Manipulation
- Clean Code Practices

The project was implemented incrementally while focusing on:
- understanding concepts deeply
- proper architecture
- real-world coding practices
- maintainable code design