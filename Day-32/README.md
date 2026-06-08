# Angular Component Communication Notes

## Overview

In Angular, components often need to communicate with each other. The most common communication patterns are:

1. Parent → Child (`@Input`)
2. Child → Parent (`@Output` + `EventEmitter`)
3. Sibling → Sibling (Shared Service)
4. Application-wide State Management (NgRx Store)

---

# 1. Parent to Child Communication (`@Input`)

Parent components pass data to child components using property binding and the `@Input` decorator.

## Parent Component

```html
<app-product [product]="product"></app-product>
```

```typescript
product = {
  name: 'Couch',
  price: 1000
};
```

## Child Component

```typescript
import { Input } from '@angular/core';

@Input()
product!: Product;
```

## Flow

```text
Parent
   ↓
Property Binding
   ↓
Child
```

## Key Point

* Parent sends data to Child.
* Uses Property Binding (`[]`).
* Uses `@Input()`.

### Interview Answer

> Parent to Child communication happens through Property Binding using `@Input()`.

---

# 2. Child to Parent Communication (`@Output` + `EventEmitter`)

Child components notify parent components using events.

## Child Component

### Declare Output Event

```typescript
import { Output, EventEmitter } from '@angular/core';

@Output()
buy = new EventEmitter<Product>();
```

### Emit Event

```typescript
handleClick() {
  this.buy.emit(this.product);
}
```

## Child Template

```html
<button (click)="handleClick()">
  Buy
</button>
```

## Parent Component

```html
<app-product
  [product]="p"
  (buy)="addToCart($event)">
</app-product>
```

## Parent TS

```typescript
addToCart(product: Product) {
  console.log(product);
}
```

## Flow

```text
User Click
     ↓
Child Component
     ↓
EventEmitter.emit()
     ↓
Parent Receives Event
```

## Key Point

* Child sends data to Parent.
* Uses Event Binding (`()`).
* Uses `@Output()` and `EventEmitter`.

### Interview Answer

> Child to Parent communication happens through Event Binding using `@Output()` and `EventEmitter`.

---

# Understanding `$event`

When a child emits data:

```typescript
this.buy.emit(this.product);
```

Angular automatically passes the emitted value into:

```html
(buy)="addToCart($event)"
```

Here:

```typescript
$event === this.product
```

So:

```typescript
addToCart($event)
```

becomes:

```typescript
addToCart(product)
```

---

# Shopping Cart Example

## Parent Component

```typescript
cart = signal<Product[]>([]);
```

Initially:

```typescript
[]
```

The cart is empty.

---

## Adding Product to Cart

```typescript
addToCart(prod: Product) {
  this.cart.mutate(cart => {
    cart.push(prod);
  });
}
```

### Before Click

```typescript
cart = []
```

Length:

```typescript
0
```

### After Click

```typescript
cart = [
  {
    name: "Couch",
    price: 1000
  }
]
```

Length:

```typescript
1
```

---

# Display Cart Count

```html
@if(cart().length > 0) {
  You have {{ cart().length }} items in the cart
}
```

### Before Adding Item

```typescript
cart().length === 0
```

Nothing is shown.

### After Adding Item

```typescript
cart().length === 1
```

Output:

```text
You have 1 item in the cart
```

---

# Signals

Angular Signals are reactive state containers.

## Create Signal

```typescript
cart = signal<Product[]>([]);
```

## Read Signal

```typescript
cart()
```

## Update Signal

```typescript
this.cart.mutate(cart => {
  cart.push(prod);
});
```

## Benefits

* Automatic UI updates.
* Simpler state management.
* Better performance.

---

# Component Communication Summary

| Communication     | Angular Feature              |
| ----------------- | ---------------------------- |
| Parent → Child    | `@Input()`                   |
| Child → Parent    | `@Output()` + `EventEmitter` |
| Sibling ↔ Sibling | Shared Service               |
| Global State      | NgRx Store                   |

---

# Quick Interview Revision

## Parent → Child

```typescript
@Input()
```

```text
Parent → Child = Property Binding
```

---

## Child → Parent

```typescript
@Output()
EventEmitter
```

```text
Child → Parent = Event + Parameter
```

---

# Complete Flow Diagram

```text
Parent
  │
  │ [product]
  ▼
Child
  │
  │ User Click
  ▼
handleClick()
  │
  │ buy.emit(product)
  ▼
Parent
  │
  │ addToCart($event)
  ▼
cart.push(product)
  │
  ▼
UI Updates Automatically
```

---

# Key Takeaway

Remember this one line:

> Parent to Child = Property (`@Input`)
> Child to Parent = Event (`@Output` + `EventEmitter`)
