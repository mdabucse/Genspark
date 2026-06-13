# Angular Unit Testing

## Overview

Angular Unit Testing is the process of testing individual units of an application such as components, services, pipes, directives, and guards in isolation. It helps ensure that each part of the application behaves as expected and reduces bugs during development.

Angular provides a powerful testing ecosystem using Jasmine, Karma, and TestBed.

---

# Testing Tools

## Jasmine

Jasmine is a behavior-driven testing framework used for writing test cases.

### Common Jasmine Functions

| Function | Purpose |
|-----------|-----------|
| describe() | Group related test cases |
| it() | Define an individual test |
| expect() | Verify expected results |
| beforeEach() | Execute setup before each test |
| afterEach() | Execute cleanup after each test |

---

## Karma

Karma is the default test runner used by Angular CLI.

### Run Tests

```bash
ng test
```

### Features

- Automatically detects changes
- Runs tests in browsers
- Generates test reports
- Supports code coverage

---

## TestBed

TestBed is Angular's primary utility for configuring and creating testing environments.

### Example

```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    declarations: [CounterComponent]
  }).compileComponents();
});
```

---

# Component Testing

## Sample Component

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `<h1>{{ count }}</h1>`
})
export class CounterComponent {
  count = 0;

  increment() {
    this.count++;
  }
}
```

---

## Component Test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CounterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should increment count', () => {
    component.increment();
    expect(component.count).toBe(1);
  });
});
```

---

# DOM Testing

DOM testing verifies whether data is rendered correctly in the template.

```typescript
it('should display count value', () => {
  component.count = 5;
  fixture.detectChanges();

  const compiled = fixture.nativeElement;

  expect(
    compiled.querySelector('h1').textContent
  ).toContain('5');
});
```

---

# Service Testing

Services contain business logic and are tested independently.

## Sample Service

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  add(a: number, b: number): number {
    return a + b;
  }
}
```

---

## Service Test

```typescript
import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  it('should add two numbers', () => {
    expect(service.add(2, 3)).toBe(5);
  });
});
```

---

# HTTP Testing

Angular provides HttpTestingController for mocking API requests.

## Service

```typescript
getUsers() {
  return this.http.get('/api/users');
}
```

---

## HTTP Test

```typescript
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

describe('UserService', () => {

  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch users', () => {

    const mockUsers = [
      {
        id: 1,
        name: 'John'
      }
    ];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');

    expect(req.request.method).toBe('GET');

    req.flush(mockUsers);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
```

---

# Mocking Dependencies

Mocking helps isolate the unit under test.

## spyOn Example

```typescript
spyOn(service, 'getUsers')
  .and.returnValue(of([]));

service.getUsers();

expect(service.getUsers)
  .toHaveBeenCalled();
```

---

# Important Testing Objects

## Fixture

Fixture is a wrapper around a component instance and template.

```typescript
fixture = TestBed.createComponent(CounterComponent);
```

---

## Component Instance

Provides access to component properties and methods.

```typescript
component = fixture.componentInstance;
```

---

## Change Detection

Updates the UI after modifying component data.

```typescript
fixture.detectChanges();
```

---

# Testing Workflow

1. Configure testing module using TestBed.
2. Create component or service instance.
3. Execute methods.
4. Verify results using expect().
5. Mock dependencies if required.
6. Run tests using Angular CLI.

---

# Best Practices

- Test one behavior per test case.
- Keep tests independent.
- Use meaningful test descriptions.
- Mock external dependencies.
- Verify both success and failure scenarios.
- Maintain high code coverage.
- Follow Arrange, Act, Assert pattern.

---

# Common Commands

## Run All Tests

```bash
ng test
```

## Run Tests with Coverage

```bash
ng test --code-coverage
```

## Build Project

```bash
ng build
```

---

# Key Takeaways

- Angular uses Jasmine and Karma for testing.
- TestBed creates a testing environment.
- Components, services, and HTTP calls can be tested independently.
- Fixtures help interact with component templates.
- HttpTestingController is used for mocking API requests.
- spyOn helps mock methods and verify interactions.
- Unit testing improves application reliability and maintainability.

---

## Technologies Covered

- Angular
- Jasmine
- Karma
- TestBed
- Component Testing
- Service Testing
- DOM Testing
- HTTP Testing
- Mocking
- Code Coverage

