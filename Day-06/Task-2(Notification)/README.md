# Simple Notification System — OOP Assignment

---

## Overview

This project is a console-based application designed to send notifications to users using different communication methods such as Email and SMS. The system is built using Object-Oriented Programming principles and is designed to be easily extendable for future notification types like WhatsApp.

---

## Objectives

- Implement a flexible notification system  
- Use interfaces to define common behavior  
- Demonstrate polymorphism  
- Maintain clean and scalable design  

---

## System Components

### 1. User

Represents a user who receives notifications.

#### Properties
- Name  
- Email  
- Phone Number  

---

### 2. Notification

Represents a message sent to a user.

#### Properties
- Message  
- Sent Date  

---

### 3. Interface: INotification

Defines the common behavior for all notification types.

#### Responsibility
- Ensures all notification types implement a Send method  

---

### 4. EmailNotification

Handles sending notifications via email.

#### Features
- Uses SMTP to send real emails  
- Sends message to user's email address  

---

### 5. SmsNotification

Handles sending notifications via SMS.

#### Features
- Simulates sending SMS to user's phone number  

---

### 6. NotificationService

Acts as a central service to send notifications.

#### Responsibility
- Accepts any notification type  
- Calls the Send method  
- Enables polymorphism  

---

## Workflow

1. Create a user with required details  
2. Choose notification type (Email or SMS)  
3. Create corresponding notification object  
4. Pass it to NotificationService  
5. Service sends the notification  

---

## OOP Concepts Used

### Encapsulation
User data is stored and accessed through class properties.

---

### Inheritance
Not heavily used, but structure allows extension for future enhancements.

---

### Polymorphism
NotificationService works with the INotification interface and can handle multiple notification types.

---

### Abstraction
INotification interface defines the behavior without implementation details.

---

### Interface
Defines a contract that all notification classes must follow.

---

## Advantages of Design

- Easy to add new notification types  
- Clean separation of responsibilities  
- Scalable and maintainable  
- Follows OOP best practices  



## Conclusion

This project demonstrates how interfaces and polymorphism can be used to build a flexible and scalable notification system. By separating responsibilities and following OOP principles, the system becomes easy to extend and maintain.

---