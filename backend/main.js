
require('dotenv').config(); // Load environment variables at the very beginning
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const auth = require('./routes/auth');
const list = require('./routes/list');

const app = express();
const port = process.env.PORT || 3000;

mongoose.set('strictQuery', true);

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/api/v1', auth);
app.use('/api/v2', list);

mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('Connected to database successfully');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error.message);
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Middleware for handling 404 errors
app.use((req, res, next) => {
  res.status(404).send({ error: 'Not Found' });
});

// Middleware for handling other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});
