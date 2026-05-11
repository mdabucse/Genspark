# PostgreSQL Learning

## 1. Advanced Joins Understanding
- Difference between INNER JOIN and LEFT JOIN
- When to use LEFT JOIN (include NULL rows)
- Anti-join pattern using LEFT JOIN + `IS NULL`
- Practical use cases (customers without orders)

---

## 2. Multi-Table Joins
- Joining:
  - `customers → orders → order_details`
  - `products → order_details`
- Understanding relationship flow between tables
- Avoiding wrong joins (must follow correct path)

---

## 3. Aggregation Deep Dive
- Correct usage of:
  - `COUNT(column)` vs `COUNT(*)`
- Grouping with unique identifiers (`customerid`)
- Multi-level aggregation (category vs product level)

---

## 4. HAVING vs WHERE (Advanced)
- HAVING works after GROUP BY
- Cannot use aliases in HAVING
- Cannot use window functions in HAVING
- Filtering aggregated vs non-aggregated data

---

## 5. Window Functions (Introduction)
- `RANK() OVER (PARTITION BY ...)`
- Concept of partitioning data
- Ranking within groups (top product per category)
- Execution order limitation (not usable in HAVING)

---

## 6. CTE (Common Table Expressions)
- Using `WITH` for cleaner queries
- Breaking complex queries into steps
- Using CTE for multi-level aggregation

---

## 7. Subqueries (Advanced Usage)
- Using subqueries for filtering groups
- `IN` vs `EXISTS`
- When to prefer `NOT EXISTS`
- Avoiding `NOT IN` with NULL issues

---

## 8. Stored Procedures (PostgreSQL)
- Creating procedures using `plpgsql`
- Procedure structure:
  - `DECLARE`
  - `BEGIN ... END`
- Parameters (`p_` prefix)
- Variables (`v_` prefix)

---

## 9. Procedure Logic Building
- Input validation using `IF NOT EXISTS`
- Using `RAISE EXCEPTION`
- Using `SELECT INTO`
- Using `RETURNING INTO`
- Multi-step transactional logic

---

## 10. Transactions & Error Handling
- Implicit transactions in PostgreSQL
- Automatic COMMIT / ROLLBACK
- Behavior of `RAISE EXCEPTION`
- Understanding "transaction aborted" error

---

## 11. Real-World Procedure Use Cases
- Place order (multi-table insert)
- Cancel order (delete with dependency)
- Transfer products (update foreign key)
- Apply discount (update with calculation)

---

## 12. Data Modeling Concepts
- Difference between:
  - Master data (products)
  - Transaction data (orders)
- Snapshot vs reference data
- Why values like price are stored again

---

## 13. SQL Execution Order (Critical Concept)

FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY

- Why alias works in ORDER BY but not WHERE/HAVING
- Why window functions fail in HAVING

---

## 14. Data Types Understanding
- INTEGER vs NUMERIC
- Precision vs performance
- Choosing correct type for:
  - IDs
  - Prices
  - Discounts

---

## 15. Common Errors & Debugging
- Type mismatch in procedures
- Alias misuse
- Wrong table reference
- GROUP BY mistakes
- Window function restrictions
- Procedure signature mismatch

---

## 16. Query Optimization Thinking
- Using INNER JOIN vs LEFT JOIN appropriately
- Avoid unnecessary DISTINCT
- Using EXISTS for performance
- Structuring queries cleanly

---

## 17. Advanced Query Patterns Learned

### Pattern 1
JOIN → GROUP BY → HAVING → ORDER BY

### Pattern 2
CTE → JOIN → AGGREGATION → FILTER

### Pattern 3
SUBQUERY → FILTER → AGGREGATION

### Pattern 4
AGGREGATION → WINDOW FUNCTION → FILTER
