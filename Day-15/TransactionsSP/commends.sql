-- Active: 1776862435972@@127.0.0.1@5432@genspark
select * from account;

create or replace procedure add_account(
	p_accno int,
	p_balance float
)
Language plpgsql
as
$$
begin
	insert into account values(p_accno,p_balance);
end;
$$;

call add_account(5,3243);

create or replace procedure add_trans(
	p_faccno int,
	p_taccno int,
	p_amount float
)
Language plpgsql
as
$$
begin
	insert into trans(fromacc,toacc,amount)
    values(p_faccno,p_taccno,p_amount);
end;
$$;

create or replace procedure update_account(
	p_accno int,
	p_balance float
)
Language plpgsql
as
$$
begin
	update account set balance = p_balance where accno=p_accno;
    
end;
$$;


call add_trans(1,2,100);
call update_account(1,1000)