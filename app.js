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
  const messageId = messages.length === 0 ? 0 : messages[messages.length - 1].id + 1;
  const infomationOfMessage = {
    id: messageId,
    content,
    nick,
    color,
  };
  messages.push(infomationOfMessage);
  if (messages.length > 60) {
    messages.shift();
  }
};

app.get('/query/:id', (request, response) => {
  let lastMessageId;
  const countOfMessages = messages.length;
  if (request.params.id === 'null') {
    if (countOfMessages === 0) {
      lastMessageId = -1;
    } else if (countOfMessages !== 0) {
      lastMessageId = messages[countOfMessages - 1].id;
    }
  } else if (request.params.id !== 'null') {
    lastMessageId = request.params.id;
  }
  const messageObject = {
    lastMessageId,
    response,
  };
  polls.push(messageObject);
  console.log(polls.length);
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
        console.log(messagesToSend);
        console.log('udało się odesłać');
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
