const { body } = require('express-validator');

const bookEntryValidator = [  
    body('title').notEmpty().withMessage('Enter the book title'),
    body('author').notEmpty().withMessage('Enter the author name'),
    body('isbn').isISBN().withMessage('Invalid ISBN entered'),
    body('publication_date').isDate().withMessage('Invalid publication date entered')
];

module.exports = { bookEntryValidator };
  