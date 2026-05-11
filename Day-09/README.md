# Notification Management System - Architecture Refactor

This project was refactored from a single console application into a layered multi-project architecture using C# class libraries and project references.

<video controls src="Notification-Output.mp4" title="Title"></video>

The main goal of this refactor was to implement:

- Separation of Concerns (SoC)
- Layered Architecture
- Project References
- Better Code Organization
- Scalable Application Structure

---

# Initial Project Structure

Initially, the project was created as a single console application where all files existed inside one project.

Structure:

```txt
Task-1
│
├── Interfaces
├── Models
├── Repository
├── Services
└── Program.cs
```

Problems with this structure:

- All logic existed inside a single project
- Business logic and UI logic were tightly coupled
- Difficult to scale the project
- Hard to maintain as the application grows

---

# Refactored Architecture

The project was converted into a layered architecture using multiple class libraries.

Final Structure:

```txt
NotificationAppSolution
│
├── NotificationAppFE
│
├── NotificationAppBLLibrary
│
├── NotificationAppDALLibrary
│
├── NotificationAppModelLibrary
│
└── NotificationApp.slnx
```

---

# Steps Followed During Refactor

## Step 1 - Created a Blank Solution

A new blank solution was created in Visual Studio.

```txt
File
→ New
→ Blank Solution
```

Solution Name:

```txt
NotificationAppSolution
```

---

## Step 2 - Created Model Library

A new Class Library project was added.

```txt
Add
→ New Project
→ Class Library
```

Project Name:

```txt
NotificationAppModelLibrary
```

This library stores:

- Models
- Interfaces
- Shared Contracts

Files moved:

```txt
Account.cs
User.cs
INotification.cs
IUser.cs
```

---

## Step 3 - Created DAL Library

A new Class Library project was added for the Data Access Layer.

Project Name:

```txt
NotificationAppDALLibrary
```

Purpose:

- Repository logic
- Data storage handling
- CRUD data operations

Files moved:

```txt
AccountRepository.cs
UserRepository.cs
```

---

## Step 4 - Created BLL Library

A new Class Library project was added for Business Logic.

Project Name:

```txt
NotificationAppBLLibrary
```

Purpose:

- Business logic
- Notification handling
- CRUD operation coordination

Files moved:

```txt
CRUD.cs
Notification.cs
EmailNotification.cs
SMSNotification.cs
```

---

## Step 5 - Created FE Application

A Console Application project was created.

Project Name:

```txt
NotificationAppFE
```

Purpose:

- User interaction
- Console menus
- Application entry point

Contains:

```txt
Program.cs
```

---

# Project References Added

After creating all projects, project references were added to establish dependency flow.

---

## DAL Library References

The DAL library depends on the Model library.

Reference added:

```txt
NotificationAppModelLibrary
```

---

## BLL Library References

The BLL library depends on:

```txt
NotificationAppDALLibrary
NotificationAppModelLibrary
```

---

## FE Application References

The FE application depends on:

```txt
NotificationAppBLLibrary
```

---

# Dependency Flow

Final dependency flow:

```txt
FE Layer
   ↓
BLL Layer
   ↓
DAL Layer
   ↓
Model Layer
```

This architecture ensures proper separation between:

- Presentation
- Business Logic
- Data Access
- Models

---

# Namespace Refactoring

After moving files into separate projects, namespaces were updated to match the new architecture.

Example:

Old Namespace:

```csharp
namespace Accounts
```

Updated Namespace:

```csharp
namespace NotificationAppModelLibrary
```

All `using` statements were updated accordingly.

---

# Build Process

After adding project references and updating namespaces:

- Solution was rebuilt
- Compilation errors were fixed
- Missing references were resolved

Commands used:

```txt
Build
→ Build Solution
```

Shortcut:

```txt
Ctrl + Shift + B
```

---

# Git Integration

The updated architecture was pushed to GitHub.

Commands used:

```bash
git add .
git commit -m "Refactored into layered architecture"
git push origin main
```

The changes were later pulled on another system using:

```bash
git pull origin main
```

---

# Running the Project

## Visual Studio

- Open `.slnx` file
- Set `NotificationAppFE` as Startup Project
- Run the application

---

## VS Code / Mac

Commands used:

```bash
dotnet restore
dotnet build
cd NotificationAppFE
dotnet run
```

---

# Key Concepts Implemented

- Layered Architecture
- Separation of Concerns
- Class Library Projects
- Project References
- Repository Pattern
- Interface-Based Design
- Business Logic Separation
- Multi-Project Solution Structure

---

# Outcome

The application was successfully converted from a single-project structure into a scalable layered architecture using:

- FE Layer
- BLL Layer
- DAL Layer
- Model Layer

This structure improves:

- Maintainability
- Scalability
- Code organization
- Reusability
- Software architecture understanding