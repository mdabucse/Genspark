## Angular Fundamentals

### Angular Architecture

* Components
* Modules
* Services
* Directives
* Pipes
* Routing

### Creating Components

```bash
ng g c component-name
```

### Data Binding

#### Interpolation

```html
{{ title }}
```

* One-way binding
* Component → View

#### Property Binding

```html
<img [src]="imageUrl">
```

* Binds component property to DOM property
* Component → View

#### Event Binding

```html
<button (click)="save()">
```

* Handles user events
* View → Component

#### Two-Way Data Binding

```html
<input [(ngModel)]="name">
```

* Component ↔ View
* Requires FormsModule

### Directives

* Structural Directives

  * *ngIf
  * *ngFor
* Attribute Directives

  * ngClass
  * ngStyle

### Services

* Business logic separation
* Dependency Injection
* Shared data across components

### Routing

```typescript
const routes = [
  { path: 'home', component: HomeComponent }
];
```

### HTTP Client

```typescript
this.http.get('/api/users');
```

* API integration
* REST communication

### Forms

* Template Driven Forms
* Reactive Forms

### Pipes

* Date Pipe
* Uppercase Pipe
* Currency Pipe

### Lifecycle Hooks

* ngOnInit
* ngOnChanges
* ngAfterViewInit
* ngOnDestroy

---

## Angular Testing

### Jasmine

* Testing framework
* Used to write test cases

Key Functions:

* describe()
* it()
* expect()
* beforeEach()
* afterEach()

### Karma

* Test Runner
* Executes Jasmine tests
* Opens browser and displays results

Command:

```bash
ng test
```

### Code Coverage

```bash
ng test --code-coverage
```

---

## Angular Change Detection

### Zone.js

Purpose:

* Tracks asynchronous operations
* Triggers Angular Change Detection

Tracks:

* setTimeout
* setInterval
* Promise
* HTTP Requests
* DOM Events

Flow:

```text
Async Task
    ↓
Zone.js
    ↓
Angular Change Detection
    ↓
UI Update
```

---

## React Fundamentals

### Creating Components

Functional Component

```jsx
function Welcome() {
  return <h1>Welcome</h1>;
}
```

Arrow Function Component

```jsx
const Welcome = () => {
  return <h1>Welcome</h1>;
};
```

### Props

```jsx
<UserCard name="Abubakkar" />
```

### State

```jsx
const [count, setCount] = useState(0);
```

### Component Structure

```text
src/
└── components/
    ├── Navbar.jsx
    ├── Footer.jsx
    └── UserCard.jsx
```

---

## Web Development Concepts

### SPA (Single Page Application)

Characteristics:

* Loads one HTML page
* Updates content dynamically
* No full page reload

Benefits:

* Faster navigation
* Better user experience
* Reduced server load

Examples:

* Gmail
* Google Maps
* Netflix

---

## AJAX

AJAX = Asynchronous JavaScript and XML

Purpose:

* Send and receive data without reloading the page

Modern Implementation:

```javascript
fetch('/api/users');
```

Benefits:

* Dynamic updates
* Faster interaction
* Better UX

---

## Image Optimization

### WebP

Advantages:

* Smaller file size
* Transparency support
* Animation support
* Faster loading

Internal Working:

1. Read Pixel Data
2. RGB → YUV Conversion
3. Block Division
4. Prediction
5. Transform
6. Quantization
7. Entropy Encoding

---

## Image Loading

### Normal Loading

```html
<img src="image.jpg">
```

* Loads immediately

### Lazy Loading

```html
<img src="image.jpg" loading="lazy">
```

Benefits:

* Faster initial page load
* Reduced bandwidth usage
* Better performance

---

## Bootstrap

### CDN

CSS

```html
<link href="bootstrap-cdn-link" rel="stylesheet">
```

JavaScript

```html
<script src="bootstrap-js-link"></script>
```

Benefits:

* Quick setup
* No installation required
* Faster prototyping

### Common Bootstrap Classes

Buttons

```html
btn btn-primary
```

Containers

```html
container
```

Grid

```html
row
col-md-6
```

Utilities

```html
d-flex
justify-content-center
align-items-center
```

---

## Angular CLI Commands

Create Component

```bash
ng g c component-name
```

Create Service

```bash
ng g s service-name
```

Create Pipe

```bash
ng g p pipe-name
```

Create Directive

```bash
ng g d directive-name
```

Create Interface

```bash
ng g i interface-name
```

Run Application

```bash
ng serve
```

Run Tests

```bash
ng test
```

Build Application

```bash
ng build
```

---

## Angular Assignment Concepts

### Product Model

```typescript
export interface Product {
  title: string;
  price: number;
  description: string;
  thumbnail: string;
}
```

### Product Card Component

Features:

* Product Image
* Product Title
* Product Price
* Product Description
* Styling with CSS

### Profile Page

Sections:

* Profile Information
* About Me
* Skills
* Education
* Achievements
* Projects
* Contact Information

---

## Key Concepts Learned

* Angular Components
* React Components
* SPA Architecture
* AJAX and Fetch API
* Angular Data Binding
* Angular Routing
* Angular Services
* Angular Forms
* Angular Pipes
* Angular Lifecycle Hooks
* Jasmine Testing
* Karma Test Runner
* Zone.js
* Bootstrap CDN
* WebP Image Optimization
* Lazy Loading
* Product Modeling
* Component-Based Architecture
* Change Detection
* API Integration
* Responsive UI Development
