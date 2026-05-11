-- Active: 1776862435972@@127.0.0.1@5432@genspark
--print the product name with the order number and quantity ordered

select p.productname,o.orderid,od.quantity from products as p
JOIN order_details as od ON p.productid=od.productid
JOIN orders o ON o.orderid = od.orderid;

select * from orders;
select * from products;
select * from order_details;

--print the same details but print the products that were never ordered too
SELECT p.productname,o.orderdate,od.quantity
FROM products p
LEFT JOIN order_details od ON p.productid = od.productid
LEFT JOIN orders o ON o.orderid = od.orderid;

-- Store Procedure

create or replace procedure proc_Get_Emplopyee_details()
language plpgsql
as $$
begin
   CREATE TEMP TABLE tmp_emp AS
   select emp.employeeid, concat(emp.firstname,' ',emp.lastname) employee_fullname,
	emp.reportsto, concat(mgr.firstname,' ',mgr.lastname) manager_name 
	from employees emp left outer join employees mgr
	on emp.reportsto = mgr.employeeid;
end;
$$;

-- reporting to manager

call proc_Get_Emplopyee_details();
select * from tmp_emp;
CREATE OR REPLACE FUNCTION reporting()
RETURNS TABLE(manager_name TEXT, report_count BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CONCAT(m.firstname, ' ', m.lastname),
        COUNT(e.employeeid)
    FROM employees e
    JOIN employees m
        ON e.reportsto = m.employeeid
    GROUP BY m.employeeid, m.firstname, m.lastname;
END;
$$;
SELECT * FROM reporting();

-- Transactions
create table account(accno int,balance float);
create table trans(id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY ,fromacc int,toacc int,amount float);

insert into account(accno,balance) values(1,1000),(2,2000),(3,500);

CREATE OR REPLACE PROCEDURE transfer_money(
    p_id INT,
    p_from INT,
    p_to INT,
    p_amount FLOAT
)
LANGUAGE plpgsql
AS $$
DECLARE
    sender_balance FLOAT;
BEGIN

    -- Get sender balance
    SELECT balance INTO sender_balance
    FROM account
    WHERE accno = p_from;

    -- Check condition
    IF sender_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient balance';
    END IF;

    -- 1. Insert transaction
    INSERT INTO trans(id, fromacc, toacc, amount)
    VALUES (p_id, p_from, p_to, p_amount);

    -- 2. Deduct from sender
    UPDATE account
    SET balance = balance - p_amount
    WHERE accno = p_from;

    -- 3. Add to receiver
    UPDATE account
    SET balance = balance + p_amount
    WHERE accno = p_to;

END;
$$;


select * from account;
select * from trans;

call transfer_money(3,1,2,300);