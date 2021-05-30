const express = require('express');
const { join } = require('path');
const bodyParser = require('body-parser');

const app = express();
const messages = [];
let polls = [];
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

const addMessage = (message) => {
  const { content, nick, color } = message;
  const infomationOfMessage = {
    id: messages.length,
    content,
    nick,
    color,
  };
  messages.push(infomationOfMessage);
};

app.get('/query/:id', (request, response) => {
  const lastMessageId = request.params.id === 'null' ? messages.length - 1 : request.params.id;
  const messageObject = {
    lastMessageId,
    response,
  };
  polls.push(messageObject);
});

app.post('/message', (require, response) => {
  const requireMessage = require.body.content;
  const { nick, color } = require.body;
  const message = {
    nick,
    color,
    content: requireMessage,
  };
  addMessage(message);
  const emptyMessageValidator = requireMessage.split('').join('');

  if (emptyMessageValidator) {
    polls.forEach((poll) => {
      const { lastMessageId } = poll;
      const pollResponse = poll.response;

      let messagesToSend = messages.filter((messageElement) => {
        return messageElement.id > lastMessageId;
      });
      try {
        messagesToSend = JSON.stringify(messagesToSend);
        pollResponse.send(messagesToSend);
      } catch (e) {
        const error = new Error(e);
      }
    });
    polls = [];
    response.end();
  } else {
    response.end();
  }
});

module.exports = app;
