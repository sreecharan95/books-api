const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware 
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, // limit each IP to 100 requests 
});

app.use(limiter);

// Book routes
app.use('/api/books', bookRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
