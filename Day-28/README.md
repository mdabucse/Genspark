## Angular Signals

### What are Signals?

Signals are Angular's reactive state management feature used to store and track state changes.

```typescript
const count = signal(0);

count.set(1);
count.update(value => value + 1);
```

### Types of Signals

#### Signal

Stores a value.

```typescript
const name = signal('John');
```

#### Computed Signal

Derived from other signals.

```typescript
const total = computed(() => price() * quantity());
```

#### Effect

Runs automatically when dependent signals change.

```typescript
effect(() => {
  console.log(count());
});
```

### Signal vs Observable

| Signal       | Observable            |
| ------------ | --------------------- |
| Stores state | Handles async streams |
| Synchronous  | Asynchronous          |
| UI state     | API calls, WebSockets |
| No subscribe | Requires subscribe    |


## API Calls in Angular

Angular uses HttpClient for API communication.

```typescript
constructor(private http: HttpClient) {}
```

### GET Request

```typescript
this.http.get('/api/users');
```

### POST Request

```typescript
this.http.post('/api/login', data);
```

### PUT Request

```typescript
this.http.put('/api/users/1', data);
```

### DELETE Request

```typescript
this.http.delete('/api/users/1');
```

---

## Observable

### What is an Observable?

An Observable emits data over time.

```typescript
observable.subscribe();
```

Used for:

* HTTP Requests
* WebSockets
* Form Changes
* Events

### Observable Lifecycle

```text
Subscribe
   ↓
next()
   ↓
complete()
```

Or

```text
Subscribe
   ↓
error()
```

---

## Promise vs Observable

| Promise              | Observable            |
| -------------------- | --------------------- |
| Single value         | Multiple values       |
| Executes immediately | Executes on subscribe |
| Cannot cancel        | Can unsubscribe       |
| then()               | pipe(), subscribe()   |

### Promise

```typescript
fetch('/users')
  .then(res => res.json());
```

### Observable

```typescript
this.http.get('/users')
  .subscribe();
```

---

## subscribe()

Used to receive Observable data.

```typescript
observable.subscribe({
  next: (data) => {},
  error: (err) => {},
  complete: () => {}
});
```

### next()

Called when data is emitted.

```typescript
next: (response) => {
  console.log(response);
}
```

### error()

Called only when an error occurs.

```typescript
error: (err) => {
  console.log(err);
}
```

Examples:

* 400 Bad Request
* 401 Unauthorized
* 404 Not Found
* 500 Internal Server Error
* Network Failure

### complete()

Called when Observable finishes successfully.

```typescript
complete: () => {
  console.log('Completed');
}
```

### Important Rules

* next() → Many times
* error() → Once
* complete() → Once
* After error() → complete() won't run
* After complete() → no more next()

---

## Angular Login Flow

### Architecture

```text
Login Component
      ↓
Auth Service
      ↓
HttpClient
      ↓
Backend API
      ↓
Observable Response
      ↓
subscribe()
```

### Login Example

```typescript
handleLoginClick() {
  this.loginservice
    .loginApiCall(this.loginmodel())
    .subscribe({
      next: (response) => {
        console.log(response);
        alert('Login Successful');
      },

      error: (err) => {
        console.log(err);
      },

      complete: () => {
        console.log('Request Completed');
      }
    });
}
```

### HTTP Request Flow

#### Success

```text
API Call
   ↓
next()
   ↓
complete()
```

#### Failure

```text
API Call
   ↓
error()
```

---

## Key Takeaways

* Signals are for state management.
* Observables are for asynchronous streams.
* Angular HttpClient returns Observables.
* subscribe() is used to consume Observable data.
* next() handles success.
* error() handles failures.
* complete() runs after successful completion.
* API calls should be placed inside Services.
* Components should consume services and subscribe to results.
