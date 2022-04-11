CREATE DATABASE blog_db;

CONNECT TO blog_db;

CREATE TABLE users(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

ALTER TABLE users ADD CONSTRAINT unique_email_user UNIQUE(email);