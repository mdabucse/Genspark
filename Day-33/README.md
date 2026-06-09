# Angular Routing

## Table of Contents

1. What is Routing?
2. Basic Routing
3. Router Outlet
4. Programmatic Navigation
5. Parameterized Routes
6. When to Send Data in URL
7. When NOT to Send Data in URL
8. Passing Data Without URL
9. Route Guards
10. Child Routes
11. Lazy Loading
12. Interview Questions

---

# 1. What is Routing?

Routing allows users to navigate between different components without reloading the page.

Example URLs:

```text
/home
/about
/contact
```

Angular loads the corresponding component based on the URL.

---

# 2. Basic Routing

## Route Configuration

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent }
];
```

## Navigation Links

```html
<a routerLink="/login">Login</a>
<a routerLink="/dashboard">Dashboard</a>
```

---

# 3. Router Outlet

Router Outlet acts as a placeholder where Angular loads routed components.

```html
<router-outlet></router-outlet>
```

Example:

```text
/dashboard
```

Angular renders:

```html
<app-dashboard></app-dashboard>
```

inside the router outlet.

---

# 4. Programmatic Navigation

Navigate using TypeScript.

```typescript
constructor(private router: Router) {}

goToDashboard() {
  this.router.navigate(['/dashboard']);
}
```

---

# 5. Parameterized Routes

Parameterized routes allow dynamic values in URLs.

## Route

```typescript
{
  path: 'user/:id',
  component: UserComponent
}
```

## URL

```text
/user/101
```

## Reading Parameters

```typescript
constructor(private route: ActivatedRoute) {}

ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
}
```

Output:

```text
101
```

---

## Multiple Parameters

```typescript
{
  path: 'user/:id/order/:orderId',
  component: OrderComponent
}
```

URL:

```text
/user/10/order/500
```

Access:

```typescript
const userId = this.route.snapshot.paramMap.get('id');
const orderId = this.route.snapshot.paramMap.get('orderId');
```

---

# 6. When to Send Data in URL

Use URL parameters when:

* Product IDs
* User IDs
* Order IDs
* Search Queries
* Category IDs

Examples:

```text
/product/10
/user/101
/order/500
```

Advantages:

* Bookmarkable
* Shareable
* SEO Friendly

---

# 7. When NOT to Send Data in URL

Never send:

* Passwords
* JWT Tokens
* Bank Details
* Personal Information

Bad Example:

```text
/login/password=123456
```

Also avoid sending large objects through URLs.

---

# 8. Passing Data Without URL

## Method 1: Navigation State

### Send

```typescript
this.router.navigate(
  ['/profile'],
  {
    state: {
      user: userData
    }
  }
);
```

### Receive

```typescript
const user = history.state.user;
```

URL:

```text
/profile
```

Data remains hidden.

---

## Method 2: Shared Service

### Service

```typescript
@Injectable()
export class DataService {
  userData: any;
}
```

### Store Data

```typescript
this.dataService.userData = user;
```

### Retrieve Data

```typescript
const user = this.dataService.userData;
```

---

# 9. Route Guards

Route Guards protect routes from unauthorized users.

Examples:

```text
/dashboard
/profile
/admin
```

Only authenticated users should access them.

---

## Generate Guard

```bash
ng generate guard auth
```

---

## Guard Logic

```typescript
export const authGuard: CanActivateFn = () => {

  const token = localStorage.getItem('token');

  return !!token;
};
```

---

## Apply Guard

```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
}
```

---

## Flow

```text
User Requests Route
        ↓
Guard Executes
        ↓
Authentication Check
        ↓
Allow or Block
```

---

# 10. Child Routes

Child Routes allow nested navigation.

Example URLs:

```text
/admin/users
/admin/settings
/admin/reports
```

---

## Route Configuration

```typescript
{
  path: 'admin',
  component: AdminComponent,
  children: [

    {
      path: 'users',
      component: UsersComponent
    },

    {
      path: 'settings',
      component: SettingsComponent
    }

  ]
}
```

---

## Parent Template

```html
<h2>Admin Panel</h2>

<router-outlet></router-outlet>
```

---

## Structure

```text
AdminComponent
      │
      └── Router Outlet
              │
              ├── UsersComponent
              └── SettingsComponent
```

---

# 11. Lazy Loading

Lazy Loading loads modules/components only when needed.

Benefits:

* Faster startup
* Better performance
* Smaller initial bundle

---

## Without Lazy Loading

```text
Application Starts
      ↓
Home
Products
Admin
Reports
Orders

All Loaded
```

---

## With Lazy Loading

```text
Application Starts
      ↓
Only Core Loads
      ↓
User Opens Admin
      ↓
Admin Module Loads
```

---

## Lazy Loaded Route

```typescript
{
  path: 'admin',
  loadChildren: () =>
    import('./admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
}
```

---

## Lazy Load Standalone Component

```typescript
{
  path: 'about',
  loadComponent: () =>
    import('./about/about.component')
      .then(m => m.AboutComponent)
}
```

---

# 12. Quick Interview Questions

## What is Routing?

Routing is the process of navigating between components in an Angular application without reloading the page.

---

## What is Router Outlet?

Router Outlet is a placeholder where Angular dynamically loads routed components.

---

## What is a Parameterized Route?

A route that accepts dynamic values using `:parameterName`.

Example:

```typescript
{
  path: 'product/:id',
  component: ProductComponent
}
```

---

## What is a Route Guard?

A Route Guard controls access to routes before navigation occurs.

---

## What are Child Routes?

Child Routes allow nested routing inside a parent route.

---

## What is Lazy Loading?

Lazy Loading loads modules/components only when needed, improving application performance.

---

## How can you pass data without showing it in the URL?

* Navigation State
* Shared Service
* State Management (NgRx)

---

# Routing Flow Summary

```text
User Clicks Link
       ↓
Router Checks Route
       ↓
Guard Executes (if present)
       ↓
Route Matched
       ↓
Component Loaded
       ↓
Displayed in Router Outlet
```
