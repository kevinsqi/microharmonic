const express = require('express');
const path = require('path');
const logger = require('morgan');

const app = express();

// Logging
app.use(logger('dev'));

// Parse incoming request JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from react app
app.use(express.static(path.join(__dirname, 'client/build')));

// Catchall to serve react index file
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
