class Chat {
  constructor() {
    this.nick = prompt('Podaj swój nick');
    this.input = document.querySelector('.irc-input');
    this.chat = document.querySelector('.irc-chat');
    this.color = [];
    this.lastMessage = null;
    this.getColor();
    document.addEventListener('keyup', this.sendMessage);
    this.getMessages();
  }

  getColor() {
    for (let i = 0; i < 3; i += 1) {
      let oneRandomPart = Math.random() * 255;
      oneRandomPart = Math.round(oneRandomPart);
      this.color.push(oneRandomPart);
    }
  }

  getMessageTemplate(message) {
    const { nick, color, content, id } = message;
    const [r, g, b] = color;
    const nickSpan = document.createElement('span');
    nickSpan.style.color = `rgb(${r},${g},${b})`;
    nickSpan.textContent = `<${nick}>:`;
    nickSpan.innerHTML += '&nbsp';
    nickSpan.classList.add('nick');

    const contentSpan = document.createElement('span');
    contentSpan.classList.add('content');
    contentSpan.textContent = content;
    const paragraph = document.createElement('div');
    paragraph.classList.add('message-wrapper');
    paragraph.append(nickSpan);
    paragraph.append(contentSpan);

    this.chat.append(paragraph);
    /* eslint-disable */
    $('.content').emoticonize();
    this.chat.scrollTop = this.chat.scrollHeight;
    this.lastMessage = id;
  }

  async getMessages() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20_000);
      const responseMessages = await fetch(`/query/${this.lastMessage}`, {
        signal: controller.signal,
      });
      const messages = await responseMessages.json();

      messages.forEach((element) => {
        this.getMessageTemplate(element);
      });
      this.chat.value = '';
    } catch (e) {
      const error = new Error(e);
    } finally {
      this.getMessages();
    }
  }

  sendMessage = async (e) => {
    const inputValue = this.input.value;
    const emptyMessageValidator = inputValue.split('').join('');
    const { key } = e;

    if (key === 'Enter' && emptyMessageValidator) {
      this.input.value = '';
      const message = {
        nick: this.nick,
        content: inputValue,
        color: this.color,
      };
      const parsedMessage = JSON.stringify(message);
      const response = await fetch('/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: parsedMessage,
      });
    }
  };
}

const ircChat = new Chat();
