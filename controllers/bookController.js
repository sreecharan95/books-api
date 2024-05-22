const bookModel = require('../models/bookModel');
const { body, validationResult } = require('express-validator');
const { bookEntryValidator } = require('./validator');

const getAllBooks = async (req, res) => {
  try {
    const allBooks = await bookModel.getAllBooks();
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await bookModel.getBookById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createBook = [

  bookEntryValidator,

  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, author, isbn, publication_date } = req.body;
  if (!title || !author || !isbn || !publication_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const newBook = await bookModel.createBook({ title, author, isbn, publication_date });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 
];

const updateBook = [
  bookEntryValidator,

  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { id } = req.params;
  const { title, author, isbn, publication_date } = req.body;
  if (!title || !author || !isbn || !publication_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const updatedBook = await bookModel.updateBook(id, { title, author, isbn, publication_date });
    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
];

const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBook = await bookModel.deleteBook(id);
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
