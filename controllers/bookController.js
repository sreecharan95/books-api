const pool = require('../database');
const { body, validationResult } = require('express-validator');

// Create a new book 
const createBook = [

  // Validation rules
  body('title').notEmpty().withMessage('Enter the book title'),
  body('author').notEmpty().withMessage('Enter the author name'),
  body('isbn').isISBN().withMessage('Invalid ISBN entered'),
  body('publication_date').isDate().withMessage('Invalid publication date entered'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, isbn, publication_date } = req.body;

    try {
      const newBook = await pool.query(
        'INSERT INTO books (title, author, isbn, publication_date) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, author, isbn, publication_date]
      );
      res.json(newBook.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

// Get all book 
const getBooks = async (req, res) => {
  try {
    const allBooks = await pool.query('SELECT * FROM books');
    res.json(allBooks.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const allBooks = await pool.query('SELECT * FROM books where ID = $1', [id]);
    res.json(allBooks.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing book 
const updateBook = [

  body('title').notEmpty().withMessage('Enter the book title'),
  body('author').notEmpty().withMessage('Enter the author name'),
  body('isbn').isISBN().withMessage('Invalid ISBN entered'),
  body('publication_date').isDate().withMessage('Invalid publication date entered'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, author, isbn, publication_date } = req.body;

    try {
      const updatedBook = await pool.query(
        'UPDATE books SET title = $1, author = $2, isbn = $3, publication_date = $4 WHERE id = $5 RETURNING *',
        [title, author, isbn, publication_date, id]
      );

      if (updatedBook.rows.length === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }

      res.json(updatedBook.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

// Delete a book 
const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBook = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);

    if (deletedBook.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
  getBookById
};
