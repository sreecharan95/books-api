const pool = require('../database');

const getAllBooks = async () => {
  const result = await pool.query('SELECT * FROM books');
  return result.rows;
};

const getBookById = async (id) => {
  const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
  return result.rows[0];
};

const createBook = async (book) => {
  const { title, author, isbn, publication_date } = book;
  const result = await pool.query(
    'INSERT INTO books (title, author, isbn, publication_date) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, author, isbn, publication_date]
  );
  return result.rows[0];
};

const updateBook = async (id, book) => {
  const { title, author, isbn, publication_date } = book;
  const result = await pool.query(
    'UPDATE books SET title = $1, author = $2, isbn = $3, publication_date = $4 WHERE id = $5 RETURNING *',
    [title, author, isbn, publication_date, id]
  );
  return result.rows[0];
};

const deleteBook = async (id) => {
  const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
