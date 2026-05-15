-- Active: 1776862435972@@127.0.0.1@5432@librarydb
-- Create the DB
CREATE DATABASE librarydb;

-- Tables Creation

CREATE TABLE MembershipType
(
    MembershipTypeId SERIAL PRIMARY KEY,
    TypeName VARCHAR(50) UNIQUE NOT NULL,
    MaxBorrowLimit INT NOT NULL,
    MaxBorrowDays INT NOT NULL
);

INSERT INTO MembershipType
(TypeName, MaxBorrowLimit, MaxBorrowDays)
VALUES
('Basic', 2, 7),
('Student', 3, 10),
('Premium', 5, 15);

CREATE TABLE Member
(
    MemberId SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(15) UNIQUE NOT NULL,
    Address TEXT,
    IsActive BOOLEAN DEFAULT TRUE,
    MembershipTypeId INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_membership
    FOREIGN KEY(MembershipTypeId)
    REFERENCES MembershipType(MembershipTypeId)
);

CREATE TABLE BookCategory
(
    CategoryId SERIAL PRIMARY KEY,
    CategoryName VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO BookCategory(CategoryName)
VALUES
('Programming'),
('Database'),
('Science'),
('History'),
('Fiction');

CREATE TABLE Book
(
    BookId SERIAL PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Author VARCHAR(100) NOT NULL,
    ISBN VARCHAR(20) UNIQUE NOT NULL,
    PublishedYear INT,
    CategoryId INT NOT NULL,

    CONSTRAINT fk_category
    FOREIGN KEY(CategoryId)
    REFERENCES BookCategory(CategoryId)
);

CREATE TABLE BookCopy
(
    CopyId SERIAL PRIMARY KEY,
    BookId INT NOT NULL,
    IsAvailable BOOLEAN DEFAULT TRUE,
    IsDamaged BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_book
    FOREIGN KEY(BookId)
    REFERENCES Book(BookId)
);

CREATE TABLE Borrowing
(
    BorrowingId SERIAL PRIMARY KEY,
    MemberId INT NOT NULL,
    CopyId INT NOT NULL,
    BorrowDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DueDate TIMESTAMP NOT NULL,
    ReturnDate TIMESTAMP NULL,
    IsReturned BOOLEAN DEFAULT FALSE,
    FineAmount DECIMAL(10,2) DEFAULT 0,
    CONSTRAINT fk_member
    FOREIGN KEY(MemberId)
    REFERENCES Member(MemberId),
    CONSTRAINT fk_copy
    FOREIGN KEY(CopyId)
    REFERENCES BookCopy(CopyId)
);

CREATE TABLE FinePayment
(
    PaymentId SERIAL PRIMARY KEY,
    BorrowingId INT NOT NULL,
    AmountPaid DECIMAL(10,2) NOT NULL,
    PaidDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_borrowing
    FOREIGN KEY(BorrowingId)
    REFERENCES Borrowing(BorrowingId)
);

-- Calculate Member Fine
CREATE OR REPLACE FUNCTION calculate_member_fine(
    p_member_id INT
)
RETURNS DECIMAL
AS
$$
DECLARE
    total_fine DECIMAL;
BEGIN

    SELECT COALESCE(SUM(FineAmount), 0)
    INTO total_fine
    FROM Borrowing
    WHERE MemberId = p_member_id
    AND FineAmount > 0;

    RETURN total_fine;

END;
$$
LANGUAGE plpgsql;

select * from Borrowing;