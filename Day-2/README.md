# RDBMS Learning – Day 2

## Topics Covered

### 1. RDBMS Terminologies
- Entity
- Attribute
- Relationship
- Table, Row, Column

---

### 2. Entity
- A real-world object or concept.
- Example: Student, Bus, Booking

---

### 3. Attribute
- Properties of an entity.
- Example: Student → Name, Age, ID

#### Attribute Types:
- Simple Attribute
- Composite Attribute
- Multivalued Attribute
- Derived Attribute

---

### 4. Keys

#### Primary Key
- Uniquely identifies each record.
- Cannot be NULL.

#### Foreign Key
- Links one table to another.
- Maintains referential integrity.

#### Composite Key
- Combination of multiple columns as a key.

#### Candidate Key
- Possible keys that can uniquely identify records.
- One of them becomes the primary key.

---

### 5. Table Types

#### Master Table
- Stores static or reference data.
- Example: Users, Buses

#### Transactional Table
- Stores dynamic data.
- Example: Bookings, Payments

---

### 6. Normalization

#### 1NF (First Normal Form)
- No repeating groups
- Atomic values only

#### 2NF (Second Normal Form)
- No partial dependency
- Applies to composite keys

#### 3NF (Third Normal Form)
- No transitive dependency

#### BCNF (Boyce-Codd Normal Form)
- Every determinant is a candidate key

---

### 7. Schema Designing
- Structuring database tables properly
- Ensuring relationships are well-defined

---

### 8. Constraints

- PRIMARY KEY
- FOREIGN KEY
- UNIQUE
- NOT NULL
- CHECK
- DEFAULT

---

## Schema Design Flow

1. Identify nouns → **Entities**
2. Assign **Primary Key** for each entity
3. Extract **Attributes**
4. Identify **Relationships**
5. Capture **Business Logic**

---

## Assignments Completed

### 1. Bus Booking App (Day 1)
- Redesigned schema
- Applied normalization techniques

### 2. HackerRank Practice
- Solved 20+ basic SQL queries

### 3. Video Store Schema
- Designed database schema
- Submitted in GCR

---

## Summary

- Built strong foundation in RDBMS concepts
- Understood normalization deeply
- Practiced real-world schema design
- Applied SQL through problem solving
