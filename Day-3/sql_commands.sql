-- Basic
-- 1. List all customers from USA.
SELECT * FROM customers
WHERE country='USA';

-- 2. List all products where UnitPrice is greater than 20.
SELECT * FROM products
WHERE UnitPrice >20;

-- 3. List all orders placed after 1997-01-01.
SELECT * FROM orders
WHERE orderdate > '1997-01-01';

-- 4. Display customers ordered by Country and then CompanyName.
SELECT * FROM customers
ORDER BY country,companyname;

-- 5. List products ordered by highest UnitPrice first.
SELECT * FROM products
ORDER BY unitprice DESC;

-- Group By
-- 6. Count how many customers are there in each country.
SELECT country,COUNT(*) AS customer_count FROM customers
GROUP BY country;

--7. Find the number of products in each category.
SELECT categoryid,COUNT(*) count_of_category FROM PRODUCTS
GROUP BY categoryid;

-- 8. Find the total number of orders handled by each employee.
SELECT employeeid,COUNT(*) as order_count FROM orders
GROUP BY employeeid;

-- 9. Find the average freight amount for each customer.
SELECT customerid,AVG(freight) as avg_amount FROM orders
GROUP BY customerid;

-- 10. Find the maximum unit price in each category.
SELECT categoryid,max(unitprice) as max_price FROM products
GROUP BY categoryid;

--Having
-- 11. Show countries having more than 5 customers.
SELECT country,COUNT(country) as country_customer_count FROM customers
GROUP BY country
HAVING COUNT(*) > 5;

-- 12. Show employees who handled more than 50 orders.
SELECT employeeid,COUNT(*) as order_count FROM orders
GROUP BY employeeid
HAVING COUNT(*) > 50;

-- 13. Show customers whose average freight is greater than 50.
SELECT customerid,AVG(freight) as avg_amount FROM orders
GROUP BY customerid
HAVING AVG(freight)>50;

-- 14. Show categories where the average product price is greater than 30.
SELECT categoryid,AVG(unitprice) as avg_amount FROM products
GROUP BY categoryid
HAVING AVG(unitprice)>30;

-- 15. Show ship countries having more than 20 orders.
SELECT shipcountry,COUNT(*) as count_of_shipcountry FROM orders
GROUP BY shipcountry
HAVING COUNT(*)>20;

--Joins
-- 16. List each order with customer company name.
SELECT o.orderid,c.companyname FROM orders AS o 
INNER JOIN customers AS c ON o.customerid = c.customerid;

-- 17. List each order with employee first name and last name.
SELECT o.orderid,e.firstname,e.lastname
FROM Employees AS e 
JOIN orders as o ON e.employeeid=o.employeeid;

-- 18. List products with their category name.
SELECT p.productname,c.categoryname
FROM products AS p
JOIN categories c ON p.categoryid=c.categoryid;

-- 19. List products with supplier company name.
SELECT p.productid,p.productname,s.companyname AS supplier_name
FROM products p JOIN suppliers s ON p.supplierid = s.supplierid;

-- 20. List orders with shipper company name. 
SELECT o.orderid,s.companyname AS shipper_name
FROM orders o JOIN shippers s ON o.shipvia = s.shipperid;


-- Medium
--21. Find total orders per customer and display customer company name.
SELECT c.customerid,c.companyname,COUNT(o.orderid) AS total_orders
FROM customers c JOIN orders o ON c.customerid = o.customerid
GROUP BY c.customerid, c.companyname;

-- 22. Find total products supplied by each supplier.
SELECT s.supplierid,s.companyname,COUNT(p.productid) AS total_products
FROM suppliers s JOIN products p ON s.supplierid = p.supplierid
GROUP BY s.supplierid, s.companyname;


-- 23. Find average product price per category with category name.
SELECT c.categoryid, c.categoryname, AVG(p.unitprice) AS avg_price
FROM categories c JOIN products p ON c.categoryid = p.categoryid
GROUP BY c.categoryid, c.categoryname;

-- 24. Find total freight per customer and order by highest total freight.
SELECT c.customerid, c.companyname, SUM(o.freight) AS total_freight
FROM customers c JOIN orders o ON c.customerid = o.customerid
GROUP BY c.customerid, c.companyname
ORDER BY total_freight DESC;

-- 25. Find employees who handled more than 25 orders.
SELECT e.employeeid, e.firstname, e.lastname, COUNT(o.orderid) AS total_orders
FROM employees e JOIN orders o ON e.employeeid = o.employeeid
GROUP BY e.employeeid, e.firstname, e.lastname
HAVING COUNT(o.orderid) > 25
ORDER BY total_orders DESC;

-- Advanced
-- 26. Find total sales amount per order.
SELECT o.orderid,SUM(od.unitprice * od.quantity * (1 - od.discount)) AS tot_sales FROM orders o
JOIN order_details as od ON od.orderid=o.orderid
GROUP BY o.orderid;

-- 27. Find total sales amount per customer.
SELECT c.customerid,c.contactname,SUM(od.unitprice * od.quantity * (1 - od.discount)) as tot_sales FROM customers as c
JOIN orders as o  ON o.customerid = c.customerid
JOIN order_details as od ON od.orderid = o.orderid
GROUP BY c.contactname,c.customerid;

-- 28. Find top 10 products by total quantity sold.
SELECT p.productid, p.productname, SUM(od.quantity) AS total_quantity
FROM products p JOIN order_details od ON p.productid = od.productid
GROUP BY p.productid, p.productname
ORDER BY total_quantity DESC
LIMIT 10;

-- 29. Find categories whose total sales are greater than 50000.
SELECT c.categoryid,c.categoryname,SUM(od.unitprice * od.quantity * (1 - od.discount)) AS total_sales
FROM categories c JOIN products p ON c.categoryid = p.categoryid
JOIN order_details od ON p.productid = od.productid
GROUP BY c.categoryid, c.categoryname
HAVING SUM(od.unitprice * od.quantity * (1 - od.discount)) > 50000
ORDER BY total_sales DESC;

-- 30. Find employees whose total sales are greater than 100000.
SELECT e.employeeid,e.firstname,e.lastname,SUM(od.unitprice * od.quantity * (1 - od.discount)) AS total_sales FROM employees e
JOIN orders o ON e.employeeid = o.employeeid
JOIN order_details od ON o.orderid = od.orderid
GROUP BY e.employeeid, e.firstname, e.lastname
HAVING SUM(od.unitprice * od.quantity * (1 - od.discount)) > 100000
ORDER BY total_sales DESC;

-- 31. Find total sales per country based on customer country.
SELECT c.country,SUM(od.unitprice * od.quantity * (1 - od.discount)) AS total_sales FROM customers c
JOIN orders o ON c.customerid = o.customerid
JOIN order_details od ON o.orderid = od.orderid
GROUP BY c.country
ORDER BY total_sales DESC;

-- 32. Find suppliers whose products generated sales above 30000.
SELECT s.supplierid,s.companyname,SUM(od.unitprice * od.quantity * (1 - od.discount)) AS total_sales FROM suppliers s
JOIN products p ON s.supplierid = p.supplierid
JOIN order_details od ON p.productid = od.productid
GROUP BY s.supplierid, s.companyname
HAVING SUM(od.unitprice * od.quantity * (1 - od.discount)) > 30000
ORDER BY total_sales DESC;

-- 33. Find customers who placed more than 10 orders and sort by order count descending.
SELECT c.customerid,c.companyname,COUNT(o.orderid) AS order_count FROM customers c
JOIN orders o ON c.customerid = o.customerid
GROUP BY c.customerid, c.companyname
HAVING COUNT(o.orderid) > 10
ORDER BY order_count DESC;

-- 34. Find monthly order count for each year and month.
SELECT EXTRACT(YEAR FROM orderdate) AS year,EXTRACT(MONTH FROM orderdate) AS month,COUNT(*) AS order_count FROM orders
GROUP BY EXTRACT(YEAR FROM orderdate),EXTRACT(MONTH FROM orderdate)
ORDER BY year, month;

-- 35. Find monthly sales amount ordered by year and month.
SELECT EXTRACT(YEAR FROM o.orderdate) AS year,EXTRACT(MONTH FROM o.orderdate) AS month,SUM(od.unitprice * od.quantity * (1 - od.discount)) AS total_sales FROM orders o
JOIN order_details od ON o.orderid = od.orderid
GROUP BY EXTRACT(YEAR FROM o.orderdate),EXTRACT(MONTH FROM o.orderdate)
ORDER BY year, month;
