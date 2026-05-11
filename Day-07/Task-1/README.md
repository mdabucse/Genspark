# Task - 1User Account CRUD System with Email & SMS Notification

## Overview

This project is a console-based application developed in C# that demonstrates a basic **User Account Management System** with CRUD operations and integrated notification functionality.

The system allows users to create, view, update, and delete account records. Additionally, it sends notifications (Email and SMS) whenever key operations are performed.

---

## Features

* Create a new user account
* View account details
* Update account information
* Delete an account
* Send Email notification
* Send SMS notification
* Menu-driven console interface
* In-memory data storage using Dictionary

---

## Technologies Used

* C#
* .NET Console Application
* Object-Oriented Programming (OOP)
* Collections (Dictionary, List)
* SMTP (for Email Notification)

---

## Project Structure

```
├── Accounts
│   └── Account.cs
├── Users
│   └── UserDetails.cs
├── Repository
│   └── AccountRepository.cs
├── Interfaces
│   ├── IRepository.cs
│   └── INotification.cs
├── Services
│   ├── AccountService.cs
│   └── NotificationService.cs
├── Notifications
│   ├── EmailNotification.cs
│   └── SmsNotification.cs
└── Program.cs
```

---

## How It Works

1. The user interacts with the system through a menu-driven console.
2. The `Program` class handles user input.
3. The `AccountService` processes business logic.
4. The `AccountRepository` performs CRUD operations using a Dictionary.
5. The `NotificationService` triggers Email and SMS notifications.
6. Notification implementations (`EmailNotification`, `SmsNotification`) handle message delivery.

---

## Sample Workflow

* User selects "Create Account"
* Enters account details
* Account is stored in repository
* Email and SMS notifications are sent
