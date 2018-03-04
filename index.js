const express = require('express');
const path = require('path');

const app = express();

// Serve static files from react app
app.use(express.static(path.join(__dirname, 'client/build')));

// Catchall to serve react index file
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
