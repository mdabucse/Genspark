# Library Management System - Test Cases

## Overview

This document contains the functional test cases performed for the Library Management System project.

The testing includes:

- Member Module
- Book Module
- Borrowing Module
- Return Module
- Fine Module
- Reports Module
- Role-Based Menu Flow
- Exception Handling

---

# 1. Member Module Test Cases

## Test Case 1 — Add Member Successfully

| Field | Value |
|---|---|
| Test Case ID | TC_MEM_001 |
| Module | Member |
| Test Scenario | Add new member |
| Input | Valid member details |
| Expected Result | Member added successfully |
| Status | Passed |

---

## Test Case 2 — Duplicate Email Validation

| Field | Value |
|---|---|
| Test Case ID | TC_MEM_002 |
| Module | Member |
| Test Scenario | Add member with duplicate email |
| Input | Existing email |
| Expected Result | DuplicateEmailException |
| Status | Passed |

---

## Test Case 3 — View Members

| Field | Value |
|---|---|
| Test Case ID | TC_MEM_003 |
| Module | Member |
| Test Scenario | View all members |
| Input | None |
| Expected Result | Members list displayed |
| Status | Passed |

---

## Test Case 4 — Search Member Successfully

| Field | Value |
|---|---|
| Test Case ID | TC_MEM_004 |
| Module | Member |
| Test Scenario | Search member by email |
| Input | Valid email |
| Expected Result | Member details displayed |
| Status | Passed |

---

## Test Case 5 — Search Non-Existing Member

| Field | Value |
|---|---|
| Test Case ID | TC_MEM_005 |
| Module | Member |
| Test Scenario | Search invalid member |
| Input | Invalid email |
| Expected Result | Member not found |
| Status | Passed |

---

## Test Case 6 — Deactivate Member

| Field | Value |
|---|---|
| Test Case ID | TC_MEM_006 |
| Module | Member |
| Test Scenario | Deactivate member |
| Input | Valid member id |
| Expected Result | Member status updated to inactive |
| Status | Passed |

---

# 2. Book Module Test Cases

## Test Case 7 — Add Book Successfully

| Field | Value |
|---|---|
| Test Case ID | TC_BOOK_001 |
| Module | Book |
| Test Scenario | Add new book |
| Input | Valid book details |
| Expected Result | Book added successfully |
| Status | Passed |

---

## Test Case 8 — View Books

| Field | Value |
|---|---|
| Test Case ID | TC_BOOK_002 |
| Module | Book |
| Test Scenario | View books |
| Input | None |
| Expected Result | Books displayed |
| Status | Passed |

---

## Test Case 9 — Search Books

| Field | Value |
|---|---|
| Test Case ID | TC_BOOK_003 |
| Module | Book |
| Test Scenario | Search books by keyword |
| Input | Book title/author keyword |
| Expected Result | Matching books displayed |
| Status | Passed |

---

## Test Case 10 — Add Book Copies

| Field | Value |
|---|---|
| Test Case ID | TC_BOOK_004 |
| Module | Book |
| Test Scenario | Add multiple book copies |
| Input | Valid book id and count |
| Expected Result | Copies added successfully |
| Status | Passed |

---

# 3. Borrowing Module Test Cases

## Test Case 11 — Borrow Book Successfully

| Field | Value |
|---|---|
| Test Case ID | TC_BORROW_001 |
| Module | Borrowing |
| Test Scenario | Borrow available book |
| Input | Valid member id and book id |
| Expected Result | Borrowing record created |
| Status | Passed |

---

## Test Case 12 — Borrow Unavailable Book

| Field | Value |
|---|---|
| Test Case ID | TC_BORROW_002 |
| Module | Borrowing |
| Test Scenario | Borrow unavailable book |
| Input | No available copies |
| Expected Result | BookUnavailableException |
| Status | Passed |

---

## Test Case 13 — Borrow Same Book Again

| Field | Value |
|---|---|
| Test Case ID | TC_BORROW_003 |
| Module | Borrowing |
| Test Scenario | Borrow same book twice |
| Input | Same member and book |
| Expected Result | AlreadyBorrowedException |
| Status | Passed |

---

## Test Case 14 — Borrow Limit Exceeded

| Field | Value |
|---|---|
| Test Case ID | TC_BORROW_004 |
| Module | Borrowing |
| Test Scenario | Borrow beyond limit |
| Input | Member exceeds max limit |
| Expected Result | BorrowLimitExceededException |
| Status | Passed |

---

## Test Case 15 — Borrow With Inactive Membership

| Field | Value |
|---|---|
| Test Case ID | TC_BORROW_005 |
| Module | Borrowing |
| Test Scenario | Borrow using inactive membership |
| Input | Inactive member |
| Expected Result | InactiveMembershipException |
| Status | Passed |

---

## Test Case 16 — Borrow With Pending Fine

| Field | Value |
|---|---|
| Test Case ID | TC_BORROW_006 |
| Module | Borrowing |
| Test Scenario | Borrow with excessive fine |
| Input | Fine > allowed limit |
| Expected Result | FineLimitExceededException |
| Status | Passed |

---

# 4. Return Module Test Cases

## Test Case 17 — Return Book Successfully

| Field | Value |
|---|---|
| Test Case ID | TC_RETURN_001 |
| Module | Return |
| Test Scenario | Return borrowed book |
| Input | Valid borrowing id |
| Expected Result | Book returned successfully |
| Status | Passed |

---

## Test Case 18 — Return Already Returned Book

| Field | Value |
|---|---|
| Test Case ID | TC_RETURN_002 |
| Module | Return |
| Test Scenario | Return already returned book |
| Input | Returned borrowing record |
| Expected Result | AlreadyReturnedException |
| Status | Passed |

---

## Test Case 19 — Return Invalid Borrowing Record

| Field | Value |
|---|---|
| Test Case ID | TC_RETURN_003 |
| Module | Return |
| Test Scenario | Return invalid borrowing |
| Input | Invalid borrowing id |
| Expected Result | BorrowingNotFoundException |
| Status | Passed |

---

## Test Case 20 — Fine Calculation

| Field | Value |
|---|---|
| Test Case ID | TC_RETURN_004 |
| Module | Return |
| Test Scenario | Return overdue book |
| Input | Delayed return |
| Expected Result | Fine calculated correctly |
| Status | Passed |

---

# 5. Fine Module Test Cases

## Test Case 21 — View Member Fine

| Field | Value |
|---|---|
| Test Case ID | TC_FINE_001 |
| Module | Fine |
| Test Scenario | View member pending fine |
| Input | Valid member id |
| Expected Result | Fine displayed |
| Status | Passed |

---

# 6. Reports Module Test Cases

## Test Case 22 — Overdue Books Report

| Field | Value |
|---|---|
| Test Case ID | TC_REPORT_001 |
| Module | Reports |
| Test Scenario | View overdue books |
| Input | None |
| Expected Result | Overdue books displayed |
| Status | Passed |

---

## Test Case 23 — Members With Pending Fine

| Field | Value |
|---|---|
| Test Case ID | TC_REPORT_002 |
| Module | Reports |
| Test Scenario | View members with pending fine |
| Input | None |
| Expected Result | Members displayed |
| Status | Passed |

---

## Test Case 24 — Most Borrowed Books

| Field | Value |
|---|---|
| Test Case ID | TC_REPORT_003 |
| Module | Reports |
| Test Scenario | View most borrowed books |
| Input | None |
| Expected Result | Books sorted by borrow count |
| Status | Passed |

---

## Test Case 25 — Available Books Report

| Field | Value |
|---|---|
| Test Case ID | TC_REPORT_004 |
| Module | Reports |
| Test Scenario | View available books |
| Input | None |
| Expected Result | Available books displayed |
| Status | Passed |

---

## Test Case 26 — Borrowing History Report

| Field | Value |
|---|---|
| Test Case ID | TC_REPORT_005 |
| Module | Reports |
| Test Scenario | View borrowing history |
| Input | Valid member id |
| Expected Result | Borrowing records displayed |
| Status | Passed |

---

# 7. Role-Based Menu Flow Test Cases

## Test Case 27 — Admin Flow Access

| Field | Value |
|---|---|
| Test Case ID | TC_ROLE_001 |
| Module | Role Flow |
| Test Scenario | Access admin menu |
| Input | Admin role |
| Expected Result | Admin features displayed |
| Status | Passed |

---

## Test Case 28 — Customer Flow Access

| Field | Value |
|---|---|
| Test Case ID | TC_ROLE_002 |
| Module | Role Flow |
| Test Scenario | Access customer menu |
| Input | Customer role |
| Expected Result | Customer features displayed |
| Status | Passed |

---

# 8. Build Verification Test Case

## Test Case 29 — Application Build

| Field | Value |
|---|---|
| Test Case ID | TC_BUILD_001 |
| Module | Build |
| Test Scenario | Build application |
| Input | dotnet build |
| Expected Result | Build succeeded |
| Status | Passed |

---

# Conclusion

All core modules of the Library Management System were tested successfully.

The project was verified for:

- Functional correctness
- Business validations
- Exception handling
- Database operations
- Role-based flow
- Reports generation
- CRUD operations
- Transaction handling

The application build and runtime execution completed successfully without critical errors.