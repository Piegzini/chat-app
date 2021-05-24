const express = require('express');
const { join } = require('path');

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'html', 'index.html'));
});
app.get('/gowno', (require, request) => {
  const log = 'dupa';
});

module.exports = app;
