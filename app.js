const express = require('express');
const { join } = require('path');
const bodyParser = require('body-parser');

const app = express();
let pools = [];
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
app.get('/query', (require, response) => {
  pools.push(response);
});

app.post('/message', (require, response) => {
  const requireMessage = require.body.content;
  const message = { content: requireMessage };
  const emptyMessageValidator = requireMessage.split('').join('');

  if (emptyMessageValidator) {
    const responseMessage = JSON.stringify(message);
    pools.forEach((poll) => {
      try {
        poll.send(responseMessage);
      } catch (e) {
        const error = new Error(e);
      }
    });
    pools = [];
    response.send(responseMessage);
  } else {
    response.end();
  }
});
module.exports = app;
