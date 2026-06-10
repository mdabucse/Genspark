# SmartShop Portal

## Project Overview

SmartShop Portal is an Angular standalone application that demonstrates:

* Angular Routing
* Standalone Components
* Dependency Injection
* HTTP API Integration
* RxJS BehaviorSubject
* Inter-Component Communication
* Login Authentication
* Protected Routes (Upcoming)
* Product Listing (In Progress)

---

## Technologies Used

* Angular 17+
* TypeScript
* RxJS
* Angular Router
* Angular HttpClient
* DummyJSON API

---

## Concepts Learned

### 1. Components

Components are the building blocks of Angular applications.

Created Components:

* Login Component
* Dashboard Component
* Header Component
* Products Component
* Product Details Component
* Profile Component

Purpose:

* UI rendering
* User interaction handling
* Data display

---

### 2. Standalone Components

Modern Angular applications use standalone components instead of NgModules.

Example:

```ts
@Component({
  standalone: true
})
```

Benefits:

* No AppModule required
* Better code organization
* Easier dependency management

---

### 3. Routing

Angular Router is used to navigate between pages without reloading the application.

Routes Implemented:

* /login
* /dashboard

Planned Routes:

* /products
* /products/:id
* /profile

Concepts:

* RouterLink
* Router Navigation
* Router Outlet

---

### 4. Router Outlet

Router Outlet acts as a placeholder where Angular loads routed components.

Example:

```html
<router-outlet></router-outlet>
```

---

### 5. Services

Services contain reusable business logic and shared application data.

Created Services:

* AuthService
* ProductService

Benefits:

* Reusability
* Separation of Concerns
* Shared State Management

---

### 6. Dependency Injection (DI)

Angular automatically provides required services.

Example:

```ts
constructor(
  private authService: AuthService
) {}
```

Benefits:

* Loose Coupling
* Reusability
* Testability

---

### 7. HttpClient

HttpClient is Angular's built-in service for API communication.

Example:

```ts
this.http.get(url)
this.http.post(url, data)
```

Operations:

* GET
* POST
* PUT
* DELETE

---

### 8. Login API Integration

DummyJSON Login API:

```http
POST https://dummyjson.com/auth/login
```

Purpose:

* Authenticate users
* Retrieve user information
* Store authenticated user data

---

### 9. RxJS

RxJS enables reactive programming in Angular.

Used Features:

* Observable
* BehaviorSubject
* Operators

Benefits:

* Reactive Data Flow
* Real-time Updates
* Better State Management

---

### 10. BehaviorSubject

BehaviorSubject stores and broadcasts the latest value to all subscribers.

Example:

```ts
private userSubject =
new BehaviorSubject<any>(null);
```

Use Case:

* Store logged-in user
* Share user data across components

Components Using User State:

* Login
* Dashboard
* Header
* Profile

---

### 11. Observable

API calls return Observables.

Example:

```ts
this.http.get(...)
```

To receive data:

```ts
.subscribe()
```

---

### 12. RxJS Operators

#### tap()

Used for side effects.

Example:

```ts
tap(user => {
  this.setUser(user);
})
```

Purpose:

* Store user
* Log data
* Trigger additional actions

---

#### map()

Used to transform API responses.

Example:

```ts
map(response => response.products)
```

Purpose:

* Extract required data
* Simplify component code

---

### 13. Local Storage

Used to persist login information.

Example:

```ts
localStorage.setItem(...)
```

Purpose:

* Maintain login state
* Support route protection

---

### 14. Dashboard Implementation

Features:

* Welcome logged-in user
* Display user name dynamically
* Navigation menu

Data Source:

```ts
authService.user$
```

---

### 15. Inter-Component Communication

Implemented using:

```ts
BehaviorSubject
```

Flow:

Login Component
→ AuthService
→ Dashboard Component

Benefits:

* Decoupled Components
* Shared Reactive State

---

## APIs Used

### Login

```http
POST https://dummyjson.com/auth/login
```

### Products

```http
GET https://dummyjson.com/products
```

---

## Current Progress

Completed:

* Angular Project Setup
* Standalone Components
* Routing Setup
* Login Form
* Login API Integration
* AuthService
* Dashboard
* BehaviorSubject Implementation
* RxJS tap Operator
* Dependency Injection

In Progress:

* Product Listing
* Product Details

Upcoming:

* Header Component
* Auth Guard
* Profile Page
* Route Protection
* Logout Functionality

---

## Run Project

Install Dependencies:

```bash
npm install
```

Start Application:

```bash
ng serve
```

Open:

```text
http://localhost:4200
```

---

## Learning Outcome

By completing this project, I learned:

* Angular Standalone Architecture
* Component-Based Development
* Routing and Navigation
* Services and Dependency Injection
* API Integration using HttpClient
* RxJS Observables
* BehaviorSubject State Management
* Inter-Component Communication
* Local Storage Usage
* Authentication Flow
* Angular Best Practices

```
```
