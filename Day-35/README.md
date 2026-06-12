# Angular NgRx (Effects & DevTools)

## Objective

Learn how Angular applications handle state management, side effects, and debugging using NgRx.

---

# Topics Covered

* Introduction to NgRx
* State Management
* Actions
* Reducers
* Store
* Selectors
* Effects
* DevTools
* Enterprise Application Flow

---

# 1. What is NgRx?

NgRx is a state management library for Angular inspired by Redux.

It provides a centralized store to manage application data and ensures predictable state updates throughout the application.

### Advantages

* Single source of truth
* Predictable state updates
* Easier debugging
* Better scalability
* Improved maintainability

---

# 2. NgRx Core Components

## Action

Actions represent events that occur in an application.

Examples:

* Login User
* Load Products
* Add Item to Cart
* Logout User

```ts
export const loadProducts = createAction(
  '[Products] Load Products'
);
```

### Purpose

* Trigger state changes
* Notify reducers and effects
* Maintain application flow

---

## Reducer

Reducers are pure functions responsible for updating the application state.

```ts
export const productReducer = createReducer(
  initialState,

  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    products
  }))
);
```

### Key Points

* Pure function
* No API calls
* No side effects
* Returns a new state object

---

## Store

The Store is the central repository that holds application state.

Example:

```ts
{
  products: [],
  cart: [],
  user: {}
}
```

### Responsibilities

* Store application data
* Provide data to components
* Manage state updates

---

## Selector

Selectors are used to retrieve data from the store.

```ts
export const selectProducts =
  createSelector(
    selectProductState,
    state => state.products
  );
```

### Benefits

* Reusable
* Optimized
* Keeps components clean

---

# 3. NgRx Effects

## What are Effects?

Effects handle side effects outside reducers.

A side effect is any operation that interacts with external systems.

Examples:

* API Calls
* Authentication
* Local Storage
* Logging
* Notifications
* File Uploads

---

## Why Use Effects?

Without Effects:

```text
Component
    ↓
Service
    ↓
API
```

Business logic becomes tightly coupled with components.

With Effects:

```text
Component
    ↓
Dispatch Action
    ↓
Effect
    ↓
API Call
    ↓
Success/Failure Action
    ↓
Reducer
    ↓
Store
```

Components remain focused only on UI rendering.

---

## Effect Example

```ts
@Injectable()
export class ProductEffects {

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      switchMap(() =>
        this.productService.getProducts().pipe(
          map(products =>
            loadProductsSuccess({ products })
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {}
}
```

---

## Effect Workflow

```text
User Action
    ↓
Dispatch Action
    ↓
Effect Triggered
    ↓
API Request
    ↓
Response Received
    ↓
Success Action
    ↓
Reducer Updates State
    ↓
UI Updates Automatically
```

---

# 4. NgRx DevTools

## Purpose

NgRx DevTools helps developers inspect actions and state changes in real time.

---

## Installation

```bash
npm install @ngrx/store-devtools
```

---

## Configuration

```ts
provideStoreDevtools({
  maxAge: 25
})
```

---

## Features

### State Inspection

View the current application state.

```json
{
  "products": [],
  "cart": []
}
```

### Action Tracking

Monitor all dispatched actions.

```text
[Products] Load Products
[Products] Load Products Success
[Cart] Add Item
```

### Time Travel Debugging

Move backward and forward through state history.

```text
Action 1 → State A
Action 2 → State B
Action 3 → State C
```

Jump to any previous state instantly.

---

# 5. Enterprise NgRx Flow

```text
User Interaction
        ↓
Dispatch Action
        ↓
Effect
        ↓
API Call
        ↓
Success/Failure Action
        ↓
Reducer
        ↓
Store Update
        ↓
Selector
        ↓
Component UI Update
```

---

# Interview Questions

## What is NgRx?

NgRx is a state management library for Angular that uses a centralized store and follows Redux principles.

---

## What is an Action?

An Action is an event that describes something that happened in the application.

---

## What is a Reducer?

A Reducer is a pure function that updates the state based on dispatched actions.

---

## What is a Selector?

A Selector is used to retrieve specific data from the store.

---

## What are Effects?

Effects handle asynchronous operations and side effects such as API calls, authentication, logging, and local storage interactions.

---

## Why should API calls be placed inside Effects?

* Keeps components clean
* Separates business logic from UI
* Improves maintainability
* Makes testing easier

---

## What are NgRx DevTools?

NgRx DevTools allow developers to inspect actions, monitor state changes, and perform time-travel debugging.

---

# Key Takeaways

* NgRx provides centralized state management.
* Actions describe events.
* Reducers update state.
* Store holds application data.
* Selectors retrieve data from the store.
* Effects handle asynchronous operations and side effects.
* DevTools help inspect state and debug applications.
* NgRx follows a predictable unidirectional data flow suitable for enterprise applications.
