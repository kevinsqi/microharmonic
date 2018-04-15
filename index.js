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
  db.query('SELECT * FROM compositions', [], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: err,
      });
    }
    return res.json({
      data: results.rows,
    });
  });
});

app.get('/api/compositions/:short_id', (req, res) => {
  db.query('SELECT * FROM compositions WHERE short_id = $1', [req.params.short_id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: err,
      });
    }
    return res.json({
      data: results.rows[0],
    });
  });
});

app.post('/api/compositions/', (req, res) => {
  db.query(
    'INSERT INTO compositions(short_id, title, json_value) VALUES($1, $2, $3) RETURNING *',
    [req.body.short_id, req.body.title, JSON.stringify(req.body.json_value)],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: err,
        });
      }
      return res.json({
        data: result.rows,
      });
    }
  );
});

// Catchall to serve react index file
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
