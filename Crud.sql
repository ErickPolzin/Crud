CREATE DATABASE IF NOT EXISTS book_crud;
USE book_crud;

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) NOT NULL,
    publicationYear INT NOT NULL,
    genre VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO books (title, author, isbn, publicationYear, genre) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 1925, 'Fiction'),
('To Kill a Mockingbird', 'Harper Lee', '9780446310789', 1960, 'Fiction'),
('1984', 'George Orwell', '9780451524935', 1949, 'Science Fiction'),
('Pride and Prejudice', 'Jane Austen', '9780141439518', 1813, 'Romance'),
('The Hobbit', 'J.R.R. Tolkien', '9780547928227', 1937, 'Fantasy'); 