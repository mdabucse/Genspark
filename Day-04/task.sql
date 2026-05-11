--  BASIC TO INTERMEDIATE

-- 1. List all customers and the total number of orders they have placed.
-- Show only customers with more than 5 orders. Sort by total orders descending.
SELECT c.customerid, c.contactname, COUNT(o.orderid) AS total_orders
FROM customers AS c
LEFT JOIN orders AS o ON c.customerid = o.customerid
GROUP BY c.customerid, c.contactname
HAVING COUNT(o.orderid) > 5
ORDER BY total_orders DESC;


-- 2. Retrieve the total sales amount per customer by joining customers, orders,
-- and order_details. Show only customers whose total sales exceed 10,000. Sort by total sales descending.
SELECT c.customerid, c.contactname, SUM(od.quantity * od.unitprice) AS total_sales
FROM customers AS c
JOIN orders AS o ON c.customerid = o.customerid
JOIN order_details AS od ON o.orderid = od.orderid
GROUP BY c.customerid, c.contactname
HAVING SUM(od.quantity * od.unitprice) > 10000
ORDER BY total_sales DESC;


-- 3. Get the number of products per category.Show only categories having more than 10 products. Sort by product count descending.
SELECT c.categoryname, COUNT(p.productid) AS product_count
FROM categories AS c
JOIN products AS p ON c.categoryid = p.categoryid
GROUP BY c.categoryname
HAVING COUNT(p.productid) > 10
ORDER BY product_count DESC;


-- 4. Display the total quantity sold per product. 
-- Include only products where total quantity sold is greater than 100. Sort by quantity descending.
SELECT p.productname, SUM(od.quantity) AS total_quantity_sold
FROM products AS p
JOIN order_details AS od ON p.productid = od.productid
GROUP BY p.productname
HAVING SUM(od.quantity) > 100
ORDER BY total_quantity_sold DESC;


-- 5. Find the total number of orders handled by each employee. 
-- Show only employees who handled more than 20 orders. Sort by order count descending.
SELECT e.firstname, e.lastname AS employee_name, COUNT(DISTINCT o.orderid) AS total_orders
FROM employees AS e
JOIN orders AS o ON e.employeeid = o.employeeid
GROUP BY e.employeeid, e.firstname, e.lastname
HAVING COUNT(DISTINCT o.orderid) > 20
ORDER BY total_orders DESC;

-- Intermediate

-- 6. Retrieve the total sales per category by joining categories, products, and order_details.
-- Show only categories with total sales above 50,000. Sort by total sales descending.
SELECT c.categoryname, SUM(od.quantity * od.unitprice) AS total_sales
FROM categories AS c
JOIN products AS p ON c.categoryid = p.categoryid
JOIN order_details AS od ON p.productid = od.productid
GROUP BY c.categoryname
HAVING SUM(od.quantity * od.unitprice) > 50000
ORDER BY total_sales
 DESC;

-- 7. List suppliers and the number of products they supply. 
-- Show only suppliers who supply more than 5 products. Sort by product count descending.
SELECT s.supplierid, s.companyname, COUNT(p.productid) AS product_count
FROM suppliers AS s
JOIN products AS p ON s.supplierid = p.supplierid
GROUP BY s.supplierid, s.companyname
HAVING COUNT(p.productid) > 5
ORDER BY product_count DESC;

-- 8. 8. Get the average unit price per category. 
-- Show only categories where the average price is above 30. Sort by average price descending.
SELECT c.categoryname, AVG(p.unitprice) AS average_price
FROM categories AS c
JOIN products AS p ON c.categoryid = p.categoryid
GROUP BY c.categoryname
HAVING AVG(p.unitprice) > 30
ORDER BY average_price DESC;

-- 9. Display the total revenue generated per employee (orders + order_details).
-- Show only employees generating more than 20,000 in revenue. Sort by revenue descending.
SELECT e.firstname, e.lastname AS employee_name, SUM(od.quantity * od.unitprice) AS total_revenue
FROM employees AS e
JOIN orders AS o ON e.employeeid = o.employeeid
JOIN order_details AS od ON o.orderid = od.orderid
GROUP BY e.employeeid, e.firstname, e.lastname
HAVING SUM(od.quantity * od.unitprice) > 20000
ORDER BY total_revenue DESC;

-- 10. Retrieve the number of orders shipped to each country. 
-- Show only countries with more than 10 orders. Sort by order count descending.
SELECT o.shipcountry, COUNT(DISTINCT o.orderid) AS total_orders
FROM orders AS o
WHERE o.shipcountry IS NOT NULL
GROUP BY o.shipcountry
HAVING COUNT(DISTINCT o.orderid) > 10
ORDER BY total_orders DESC;

-- Advanced
-- 11. Find customers and the average order value (orders + order_details).
-- Show only customers with average order value greater than 500. Sort by average descending.
SELECT c.customerid, c.contactname, AVG(od.quantity * od.unitprice) AS average_order_value
FROM customers AS c
JOIN orders AS o ON c.customerid = o.customerid
JOIN order_details AS od ON o.orderid = od.orderid
GROUP BY c.customerid, c.contactname
HAVING AVG(od.quantity * od.unitprice) > 500
ORDER BY average_order_value DESC;

-- 12. Get the top-selling products per category (by total quantity sold).
-- Show only products with total quantity sold above 200. Sort within category by quantity descending.
WITH product_sales AS (
    SELECT p.categoryid,p.productid,p.productname,SUM(od.quantity) AS total_quantity
    FROM products p
    JOIN order_details od 
    ON p.productid = od.productid
    GROUP BY p.categoryid, p.productid, p.productname
    HAVING SUM(od.quantity) > 200
)
SELECT categoryid,productname,total_quantity
FROM (
    SELECT *,RANK() OVER (PARTITION BY categoryid ORDER BY total_quantity DESC) AS rnk FROM product_sales
) ranked
WHERE rnk = 1
ORDER BY categoryid, total_quantity DESC;

-- 13. Retrieve the total discount given per product (order_details).
-- Show only products where total discount exceeds 1,000. Sort by discount descending.
SELECT p.productid, p.productname, SUM(od.quantity * od.unitprice * (od.discount / 100)) AS total_discount
FROM products AS p
JOIN order_details AS od ON p.productid = od.productid
GROUP BY p.productid, p.productname
HAVING SUM(od.quantity * od.unitprice * (od.discount / 100)) > 1000
ORDER BY total_discount DESC;

-- 14. List employees and the number of unique customers they handled.
-- Show only employees who handled more than 15 unique customers. Sort by count descending.
SELECT e.employeeid, e.firstname, e.lastname AS employee_name, COUNT(DISTINCT o.customerid) AS unique_customers
FROM employees AS e
JOIN orders AS o ON e.employeeid = o.employeeid
GROUP BY e.employeeid, e.firstname, e.lastname
HAVING COUNT(DISTINCT o.customerid) > 15
ORDER BY unique_customers DESC;


-- 15. Find the monthly total sales (year + month) using orders and order_details.
-- Show only months where total sales exceed 30,000. Sort by year and month ascending.
SELECT EXTRACT(YEAR FROM o.orderdate) AS year, EXTRACT(MONTH FROM o.orderdate) AS month, SUM(od.quantity * od.unitprice) AS total_sales
FROM orders AS o
JOIN order_details AS od ON o.orderid = od.orderid
GROUP BY year, month
HAVING SUM(od.quantity * od.unitprice) > 30000
ORDER BY year ASC, month ASC;














-- Storing Procedure
-- 1. Create a stored procedure to place a new order for an existing customer with one product. 
-- Insert into orders and order_details in a single transaction.

CREATE OR REPLACE PROCEDURE place_order( 
    p_customerid TEXT,
    p_productid INT,
    p_quantity INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_orderid INT;
    v_price NUMERIC;
BEGIN
    -- Find the customer is exists or NOT
    IF NOT EXISTS (SELECT 1 FROM customers WHERE customerid = p_customerid) THEN
        RAISE EXCEPTION 'Invalid Customer ID %', p_customerid;
    END IF;

    -- Find the product price
    IF  EXISTS (SELECT 1 FROM customers WHERE customerid = p_customerid) THEN
        SELECT unitprice INTO v_price
        FROM products
        WHERE productid = p_productid;
    ELSE
        RAISE EXCEPTION 'Invalid Product ID %', p_productid;
    END IF;

     -- Insert order
    INSERT INTO orders(customerid, orderdate)
    VALUES (p_customerid, CURRENT_DATE)
    RETURNING orderid INTO v_orderid; -- The orderid autogenerated so we can get the id and insert into order_details

    -- Insert order details
        INSERT INTO order_details(orderid, productid, quantity, unitprice)
        VALUES (v_orderid, p_productid, p_quantity, v_price);

END;
$$;

CALL place_order('ALFKI', 1, 5);

SELECT * FROM orders WHERE customerid = 'ALFKI' ORDER BY orderdate DESC;



-- 2. Create a stored procedure to update product stock after an order is placed.
-- If stock is not enough, rollback the transaction.

CREATE OR REPLACE PROCEDURE update_stock(
    p_productid INT,
    p_quantity INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_stock INT;
BEGIN
    -- Get current stock
    SELECT unitsinstock INTO v_stock
    FROM products
    WHERE productid = p_productid;
    -- Check if stock is sufficient
    IF v_stock < p_quantity THEN
        RAISE EXCEPTION 'Insufficient stock for product ID %', p_productid;
    END IF;
    -- Update stock
    UPDATE products
    SET unitsinstock = unitsinstock - p_quantity
    WHERE productid = p_productid;
END;
$$;

CALL update_stock(1, 5);
SELECT productid, productname, unitsinstock FROM products WHERE productid = 1;

-- 3. Create a stored procedure to cancel an order.
-- Delete records from order_details first, then from orders, using a transaction.
CREATE OR REPLACE PROCEDURE cancel_order(
    p_orderid INT
)
LANGUAGE plpgsql
AS $$
BEGIN

    -- Check if order exists
    IF NOT EXISTS (
        SELECT 1 FROM orders WHERE orderid = p_orderid
    ) THEN
        RAISE EXCEPTION 'Order ID % does not exist ', p_orderid;
    END IF;

    -- Delete order details first (child table)
    DELETE FROM order_details 
    WHERE orderid = p_orderid;

    -- Delete order (parent table)
    DELETE FROM orders 
    WHERE orderid = p_orderid;

END;
$$;


CALL cancel_order(10249);

SELECT * FROM orders WHERE orderid = 10249;

-- 4. Create a stored procedure to transfer products from one supplier to another. 
-- If the old supplier or new supplier does not exist, rollback.
CREATE OR REPLACE PROCEDURE transfer_products(
    p_old_supplier INT,
    p_new_supplier INT
)
LANGUAGE plpgsql
AS $$
BEGIN

    -- Check old supplier exists
    IF NOT EXISTS (
        SELECT 1 FROM suppliers WHERE supplierid = p_old_supplier
    ) THEN
        RAISE EXCEPTION 'Old Supplier ID % does not exist', p_old_supplier;
    END IF;

    -- Check new supplier exists
    IF NOT EXISTS (
        SELECT 1 FROM suppliers WHERE supplierid = p_new_supplier
    ) THEN
        RAISE EXCEPTION 'New Supplier ID % does not exist', p_new_supplier;
    END IF;

    -- Prevent same supplier transfer
    IF p_old_supplier = p_new_supplier THEN
        RAISE EXCEPTION 'Both supplier  same';
    END IF;

    -- Transfer products Here we just change the supplierid in products table 
    UPDATE products
    SET supplierid = p_new_supplier
    WHERE supplierid = p_old_supplier;

END;
$$;

CALL transfer_products(1, 2);
SELECT productid, productname, supplierid FROM products WHERE supplierid IN (1, 2);


-- 5.Create a stored procedure to update the price of all products in a category by a percentage.
-- Rollback if the percentage is less than or equal to zero.
CREATE OR REPLACE PROCEDURE update_category_prices(
    p_categoryid INT,
    p_percentage NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if percentage is valid
    IF p_percentage <= 0 THEN
        RAISE EXCEPTION 'Percentage must be +ve';
    END IF;

    -- Update prices for all products in the category
    UPDATE products
    SET unitprice = unitprice * (1 + p_percentage / 100)
    WHERE categoryid = p_categoryid;

END;
$$;
CALL update_category_prices(1, 10);
SELECT productid, productname, unitprice FROM products WHERE categoryid = 1;

-- 6. Create a stored procedure to add a new product under an existing category and supplier.
-- Rollback if the category or supplier does not exist.
CREATE OR REPLACE PROCEDURE add_product(
    p_productname TEXT,
    p_supplierid INT,
    p_categoryid INT,
    p_unitprice NUMERIC,
    p_unitsinstock INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if supplier exists
    IF NOT EXISTS (
        SELECT 1 FROM suppliers WHERE supplierid = p_supplierid
    ) THEN
        RAISE EXCEPTION 'Supplier ID % does not exist', p_supplierid;
    END IF;

    -- Check if category exists
    IF NOT EXISTS (
        SELECT 1 FROM categories WHERE categoryid = p_categoryid
    ) THEN
        RAISE EXCEPTION 'Category ID % does not exist', p_categoryid;
    END IF;

    -- Insert new product
    INSERT INTO products(productname, supplierid, categoryid, unitprice, unitsinstock)
    VALUES (p_productname, p_supplierid, p_categoryid, p_unitprice, p_unitsinstock);

END;
$$;

CALL add_product('New Product', 1, 1, 20.00, 100);

SELECT productid, productname, supplierid, categoryid FROM products WHERE productname = 'New Product';

-- 7 Create a stored procedure to delete a customer only if the customer has no orders. 
-- Use a transaction and rollback if orders exist.
CREATE OR REPLACE PROCEDURE delete_customer(
    p_customerid TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if customer has any orders
    IF EXISTS (
        SELECT 1 FROM orders WHERE customerid = p_customerid
    ) THEN
        RAISE EXCEPTION 'Customer ID % has existing orders and cannot be deleted', p_customerid;
    END IF;

    -- Delete the customer
    DELETE FROM customers WHERE customerid = p_customerid;

END;
$$;
CALL delete_customer('FISSA');
SELECT * FROM customers WHERE customerid = 'FISSA';

-- 8 Create a stored procedure to apply a discount to all order details for a specific order.
-- Rollback if the order does not exist.
CREATE OR REPLACE PROCEDURE apply_discount(
    p_orderid INT,
    p_discount NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if order exists
    IF NOT EXISTS (
        SELECT 1 FROM orders WHERE orderid = p_orderid
    ) THEN
        RAISE EXCEPTION 'Order ID % does not exist', p_orderid;
    END IF;
    
    -- Apply discount to all order details for the order
    UPDATE order_details
    SET unitprice = unitprice * (1 - p_discount / 100)
    WHERE orderid = p_orderid;
END;
$$;
CALL apply_discount(10250, 5::NUMERIC);
SELECT orderid, productid, unitprice FROM order_details WHERE orderid = 10250;

-- 9. Create a stored procedure to place an order with multiple products. Insert the order and all order items in one transaction.
-- If any product is invalid or stock is insufficient, rollback the complete order.
CREATE OR REPLACE PROCEDURE place_multi_product_order(
    p_customerid TEXT,
    p_products JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_orderid INT;
    v_productid INT;
    v_quantity INT;
    v_price NUMERIC;
BEGIN
    -- Check if customer exists
    IF NOT EXISTS (SELECT 1 FROM customers WHERE customerid = p_customerid) THEN
        RAISE EXCEPTION 'Invalid Customer ID %', p_customerid;
    END IF;
    -- Insert order
    INSERT INTO orders(customerid, orderdate)
    VALUES (p_customerid, CURRENT_DATE)
    RETURNING orderid INTO v_orderid;
    -- Loop through products in JSONB array
    FOR i IN 0 .. jsonb_array_length(p_products) - 1 LOOP
        v_productid := (p_products->i->>'productid')::INT;
        v_quantity := (p_products->i->>'quantity')::INT;
        -- Check if product exists and get price
        IF NOT EXISTS (SELECT 1 FROM products WHERE productid = v_productid) THEN
            RAISE EXCEPTION 'Invalid Product ID %', v_productid;
        END IF;
        SELECT unitprice INTO v_price FROM products WHERE productid = v_productid;
        -- Check stock
        IF (SELECT unitsinstock FROM products WHERE productid = v_productid) < v_quantity THEN
            RAISE EXCEPTION 'Insufficient stock for product ID %', v_productid;
        END IF;
        -- Insert order details
        INSERT INTO order_details(orderid, productid, quantity, unitprice)
        VALUES (v_orderid, v_productid, v_quantity, v_price);
        -- Update stock
        UPDATE products
        SET unitsinstock = unitsinstock - v_quantity
        WHERE productid = v_productid;
    END LOOP;
END;
$$;

CALL place_multi_product_order('ALFKI', '[{"productid": 1, "quantity": 5}, {"productid": 2, "quantity": 3}]'::JSONB);
SELECT * FROM orders WHERE customerid = 'ALFKI' ORDER BY orderdate DESC;
SELECT * FROM order_details WHERE orderid = (SELECT orderid FROM orders WHERE customerid = 'ALFKI' ORDER BY orderdate DESC LIMIT 1);