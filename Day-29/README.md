## Angular Interceptor

### Purpose

Intercepts HTTP requests and responses globally.

### Common Use Cases

* Add JWT tokens
* Global error handling
* Request/response logging
* Loading indicators
* Request modification

### Key Concepts

* Registered using `provideHttpClient(withInterceptors())`
* Executes before requests reach the backend
* Can modify requests using `req.clone()`
* Supports multiple interceptors

### JWT Example

```ts
const cloned = req.clone({
  headers: req.headers.set(
    'Authorization',
    `Bearer ${token}`
  )
});
```

---

## Angular app.config.ts

### Purpose

Registers application-wide providers and configurations.

### Common Providers

* Router
* HttpClient
* Interceptors
* Animations

### Example

```ts
providers: [
  provideHttpClient(
    withInterceptors([authInterceptor])
  )
]
```

---

## RxJS Observable

### Definition

A data source that emits values over time.

### Characteristics

* Unicast
* Lazy execution
* Each subscriber gets its own execution

### Example

```ts
const observable = new Observable(observer => {
  observer.next('Hello');
});
```

### Lifecycle

```text
next()
next()
complete()
```

---

## RxJS Observer

### Definition

A consumer that receives values emitted by an Observable.

### Methods

```ts
{
  next: () => {},
  error: () => {},
  complete: () => {}
}
```

### Example

```ts
observable.subscribe({
  next: value => console.log(value)
});
```

---

## RxJS Subject

### Definition

A special Observable that acts as both an Observable and an Observer.

### Features

* Can emit values using `next()`
* Supports multiple subscribers
* Multicasts values

### Example

```ts
const subject = new Subject<string>();

subject.subscribe(value => {
  console.log(value);
});

subject.next('Angular');
```

### Common Use Cases

* Component communication
* Event broadcasting
* Search functionality
* Real-time updates

---

## Observable vs Subject

| Observable                        | Subject               |
| --------------------------------- | --------------------- |
| Unicast                           | Multicast             |
| Cannot call `next()` externally   | Can call `next()`     |
| Separate execution per subscriber | Shared execution      |
| Data producer                     | Producer and consumer |

---

## Subject Lifecycle

### Emit Value

```ts
subject.next(value);
```

### Complete Stream

```ts
subject.complete();
```

### Cleanup

```ts
subscription.unsubscribe();
```

---

## RxJS Pipe

### Purpose

Transforms and filters data before it reaches subscribers.

### Common Operators

* map()
* filter()
* debounceTime()
* distinctUntilChanged()
* take()
* tap()

### Example

```ts
subject.pipe(
  filter(value => value.length > 3)
)
.subscribe(value => {
  console.log(value);
});
```

---

## Search Optimization Using Pipe

### Example

```ts
searchSubject.pipe(
  debounceTime(500),
  distinctUntilChanged()
)
.subscribe(searchText => {
  // API Call
});
```

### Benefits

* Reduces API calls
* Improves performance
* Prevents duplicate requests

---

## Fuzzy Logic

### Definition

A decision-making approach that uses degrees of truth instead of strict true/false values.

### Traditional Logic

```text
TRUE or FALSE
0 or 1
```

### Fuzzy Logic

```text
0.0 to 1.0
Partially True
```

### Example

```text
Temperature = 30°C

Hot = 0.6
Warm = 0.4
```

---

## Fuzzy Logic Components

### Fuzzification

Converts crisp values into fuzzy values.

### Rule Base

Defines decision rules.

Example:

```text
IF Temperature is Hot
THEN Fan Speed is High
```

### Inference Engine

Applies rules to calculate results.

### Defuzzification

Converts fuzzy output into a real value.

---

## Fuzzy Product Recommendation System

### Data Source

```text
https://dummyjson.com/products
```

### Factors

* Price
* Rating
* Discount

### Sample Formula

```ts
score =
(cheapScore +
ratingScore +
discountScore) / 3;
```

### Workflow

```text
API Data
   ↓
Fuzzification
   ↓
Rule Evaluation
   ↓
Score Calculation
   ↓
Product Ranking
```

### Benefits

* Better recommendations
* Human-like decision making
* Flexible product ranking
