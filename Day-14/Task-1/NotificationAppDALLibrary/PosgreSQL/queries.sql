-- Active: 1776862435972@@127.0.0.1@5432@notificationdb
CREATE DATABASE notificationdb;

-- Accounts Table
CREATE TABLE accounts(
    accountnumber VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100),
    balance REAL,
    createdTime TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users(
    username VARCHAR(100) PRIMARY KEY,
    email VARCHAR(255),
    phonenumber VARCHAR(50)
);

-- Notification table
CREATE TABLE notifications(
    id SERIAL PRIMARY KEY,
    accountnumber VARCHAR(50),
    username VARCHAR(100),
    message TEXT,
    notificationtype VARCHAR(50),
    sentdate TIMESTAMP,
    CONSTRAINT fk_account
    FOREIGN KEY(accountnumber)
    REFERENCES accounts(accountnumber)
);

# Tested the Insertion
INSERT INTO notifications(
    accountnumber,
    username,
    message,
    notificationtype,
    sentdate)
values ('12345','abu','vankkam','Text','2026-05-11 14:32:10');

select * from accounts;

