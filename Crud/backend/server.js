const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const Joi = require('joi');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'book_crud'
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Validation schema
const bookSchema = Joi.object({
  id: Joi.number().optional(),
  title: Joi.string().required().min(1).max(255),
  author: Joi.string().required().min(1).max(255),
  isbn: Joi.string().required().length(13),
  publicationYear: Joi.number().integer().min(1000).max(new Date().getFullYear()),
  genre: Joi.string().required().min(1).max(100),
  created_at: Joi.date().optional()
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Routes
app.get('/api/books', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const countQuery = 'SELECT COUNT(*) as total FROM books';
  const dataQuery = 'SELECT * FROM books LIMIT ? OFFSET ?';

  db.query(countQuery, (err, countResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const total = countResult[0].total;

    db.query(dataQuery, [limit, offset], (err, books) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        data: books,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    });
  });
});

app.get('/api/books/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('SELECT * FROM books WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    res.json(results[0]);
  });
});

app.post('/api/books', (req, res) => {
  const { error } = bookSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  const { title, author, isbn, publicationYear, genre } = req.body;
  const query = 'INSERT INTO books (title, author, isbn, publicationYear, genre) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [title, author, isbn, publicationYear, genre], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ 
      id: result.insertId,
      ...req.body 
    });
  });
});

app.put('/api/books/:id', (req, res) => {
  const { error } = bookSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  const { id } = req.params;
  const { title, author, isbn, publicationYear, genre } = req.body;
  const query = 'UPDATE books SET title = ?, author = ?, isbn = ?, publicationYear = ?, genre = ? WHERE id = ?';
  
  db.query(query, [title, author, isbn, publicationYear, genre, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    res.json({ 
      id: parseInt(id),
      ...req.body 
    });
  });
});

app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM books WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    res.json({ message: 'Book deleted successfully' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 