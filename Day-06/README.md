# OOP in C# — Complete Learning Summary

---

## Overview

This document summarizes the core Object-Oriented Programming (OOP) concepts learned using C#, along with key rules, insights, and important takeaways.

---

## 1. Encapsulation

### Definition
Encapsulation is the process of wrapping data and methods together and controlling access to the data.

### Key Points
- Use private variables  
- Access via public methods or properties  
- Add validation before modifying data  

### Why it matters
- Prevents invalid data  
- Improves security  
- Makes code maintainable  

### Memory Tip
Encapsulation = Protect and control data

---

## 2. Inheritance

### Definition
Inheritance allows a class to acquire properties and behavior from another class.

### Key Points
- Child class inherits from parent class  
- Represents an "is-a" relationship  
- Promotes code reuse  

### Example Relationship
SavingsAccount is an Account

### Memory Tip
Inheritance = Reuse and relationship

---

## 3. Polymorphism

### Definition
Polymorphism allows the same method to behave differently based on the object.

---

### Types

#### Method Overloading (Compile-time)
- Same method name, different parameters  
- Decided at compile time  
- No inheritance required  

Memory Tip  
Overloading = Same method, different inputs  

---

#### Method Overriding (Runtime)
- Same method, different implementation  
- Requires inheritance  
- Uses virtual and override  

Memory Tip  
Overriding = Same method, different behavior  

---

### Important Rule

Reference type determines access  
Object type determines behavior  

---

## 4. Abstraction

### Definition
Abstraction hides implementation details and shows only essential features.

### Key Points
- Implemented using abstract classes or interfaces  
- Abstract methods have no body  
- Must be implemented in child classes  

### Memory Tip
Abstraction = Show what, hide how  

---

## 5. Abstract Class

### Definition
A class that cannot be instantiated and may contain both implemented and unimplemented methods.

### Key Points
- Can contain method implementations  
- Can have variables and constructors  
- Supports single inheritance  

### Memory Tip
Abstract class = Partial implementation  

---

## 6. Interface

### Definition
An interface is a contract that defines methods a class must implement.

### Key Points
- No method implementation  
- No fields  
- Supports multiple inheritance  
- All methods must be implemented  

### Memory Tip
Interface = Contract or rule  

---

## 7. Abstract Class vs Interface

| Feature | Abstract Class | Interface |
|--------|---------------|----------|
| Methods | Can have implementation | No implementation |
| Variables | Allowed | Not allowed |
| Inheritance | Single | Multiple |
| Purpose | Shared base logic | Define capability |

---

## 8. Casting

### Definition
Casting is used to access child-specific members from a parent reference.

### Key Points
- Required when using polymorphism  
- Unsafe if object type is incorrect  

### Safe Casting
Use type checking before casting  

### Memory Tip
Casting = Access real object type  

---

## 9. Virtual and Override

### Virtual
- Allows a method to be overridden  

### Override
- Provides new implementation in child class  

### Rule
Base method must be virtual  
Child method must be override  

---

## 10. ToString() Concept

### Key Idea
- Defined in System.Object  
- Already virtual  
- Automatically called by Console.WriteLine(object)  

### Insight
Override ToString() to control object output  

---

## 11. Polymorphism with Interface (Important)

### Pattern

- Define interface  
- Implement in multiple classes  
- Use a common service  

### Benefit
- Flexible  
- Extendable  
- Clean design  

---

## 12. Notification System (Mini Project)

### Components

- User class  
- INotification interface  
- EmailNotification class  
- SmsNotification class  
- NotificationService  

---

### Key Design Idea

One interface → multiple implementations → one service  

---

### Flow

User → Notification → Service → Send method  

---

### Concepts Used

- Interface  
- Polymorphism  
- Abstraction  
- Encapsulation  

---

## 13. Key Rules to Remember

- Child inherits parent members  
- Parent reference limits access  
- Object type decides method execution  
- Interface enforces implementation  
- Abstract class provides structure  
- Override requires virtual  

---

## 14. Common Mistakes

- Forgetting virtual keyword  
- Trying to access child members via parent reference  
- Confusing overloading and overriding  
- Not using interfaces for flexibility  
- Incorrect casting  

---

## 15. One-Line Memory Guide

- Encapsulation = Protect data  
- Inheritance = Reuse code  
- Polymorphism = Many behaviors  
- Abstraction = Hide complexity  
- Interface = Define rules  
- Casting = Access real type  

---

## Conclusion

You have learned the complete foundation of OOP in C#, including how to design scalable and maintainable systems using interfaces, inheritance, and polymorphism.

These concepts are essential for real-world applications and software design.

---