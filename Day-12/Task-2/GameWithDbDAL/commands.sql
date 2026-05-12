-- Active: 1776862435972@@127.0.0.1@5432@gamewithdb
-- Create a Db For Game
CREATE DATABASE gamewithdb;

-- Create users table
CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Create word table
CREATE TABLE words
(
    id SERIAL PRIMARY KEY,
    word VARCHAR(5) NOT NULL
);

-- Create Scores Table
CREATE TABLE scores
(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    score INT,
    difficulty VARCHAR(20),
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the Hidden words
INSERT INTO words(word)
VALUES
('APPLE'),
('MANGO'),
('GRAPE'),
('PLANT'),
('TRAIN'),
('BRAIN');

SELECT * FROM scores;