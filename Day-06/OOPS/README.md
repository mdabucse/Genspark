# Object-Oriented Programming (OOPs) — Complete Notes

---

## 1. Encapsulation

### Definition
Encapsulation is the process of wrapping data and methods together and restricting direct access to the data.

### Purpose
- Protect data from invalid modification  
- Provide controlled access  
- Improve security and maintainability  

### Key Points
- Use private variables  
- Access data through public methods or properties  
- Apply validation before updating values  

### Common Mistakes
- Making variables public  
- Not validating input data  

### Memory Tip
Encapsulation = Protect and control data

---

## 2. Inheritance

### Definition
Inheritance is a mechanism where one class acquires properties and behavior from another class.

### Purpose
- Reuse code  
- Establish relationships between classes  
- Reduce duplication  

### Key Points
- Child class inherits from parent class  
- Represents an "is-a" relationship  
- Child gets access to parent members  

### Common Mistakes
- Using inheritance without a proper relationship  
- Creating unrelated class hierarchies  

### Memory Tip
Inheritance = Reuse and relationship

---

## 3. Polymorphism

### Definition
Polymorphism allows the same method to behave differently based on the object.

### Types
- Compile-time polymorphism (method overloading)  
- Runtime polymorphism (method overriding)  

---

### 3.1 Method Overloading

#### Definition
Method overloading allows multiple methods with the same name but different parameters.

#### Key Points
- No inheritance required  
- Methods differ by parameter type, number, or order  
- Decision is made at compile time  

#### Memory Tip
Overloading = Same method, different inputs

---

### 3.2 Method Overriding

#### Definition
Method overriding allows a child class to provide a different implementation of a method defined in the parent class.

#### Key Points
- Requires inheritance  
- Base method must be virtual  
- Child method must use override  
- Decision is made at runtime  

#### Memory Tip
Overriding = Same method, different behavior

---

## 4. Abstraction

### Definition
Abstraction is the process of hiding implementation details and showing only essential features.

### Purpose
- Reduce complexity  
- Focus on what an object does instead of how it does it  
- Enforce structure in design  

### Key Points
- Implemented using abstract classes or interfaces  
- Abstract methods do not have a body  
- Must be implemented in derived classes  

### Common Mistakes
- Trying to instantiate abstract classes  
- Forgetting to implement abstract methods  

### Memory Tip
Abstraction = Show what, hide how

---

## 5. Abstract Class

### Definition
An abstract class is a class that cannot be instantiated and may contain both implemented and unimplemented methods.

### Key Points
- Can contain method implementations  
- Can have variables and constructors  
- Supports single inheritance  
- Used for common base functionality  

### Memory Tip
Abstract class = Partial implementation

---

## 6. Interface

### Definition
An interface is a contract that defines a set of methods that a class must implement.

### Key Points
- Contains only method declarations (no implementation)  
- Cannot contain fields  
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
| Purpose | Base class with shared logic | Define capabilities |

---

## 8. Important Concepts Summary

### Access Rule
Reference type determines what members can be accessed.

### Behavior Rule
Actual object type determines which method executes.

### Casting
Used to access child-specific members from a parent reference.

### Virtual and Override
- virtual allows overriding  
- override modifies parent behavior  

---

## Final Summary

- Encapsulation protects data  
- Inheritance enables reuse  
- Polymorphism allows dynamic behavior  
- Abstraction enforces structure  
- Interface defines capabilities  

---

## One-Line Memory Guide

- Encapsulation = Protect data  
- Inheritance = Reuse code  
- Polymorphism = Many behaviors  
- Abstraction = Hide details  
- Interface = Define rules  