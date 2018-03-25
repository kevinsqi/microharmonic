require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const db = require('./db');

const app = express();

// Logging
app.use(logger('dev'));

// Parse incoming request JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from react app
app.use(express.static(path.join(__dirname, 'client/build')));

// Routes
app.get('/api/compositions/', (req, res, next) => {
  // noreintegrate
  db.query('SELECT * FROM compositions', [], (err, dbRes) => {
    if (err) {
      return next(err);
    }
    console.log(dbRes.rows);
  });
  return res.json({
    data: [],
  });
});

// Catchall to serve react index file
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
