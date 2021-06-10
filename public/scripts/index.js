class Chat {
  constructor() {
    this.nick = prompt('Podaj swoją nazwę');
    this.input = document.querySelector('.irc-input');
    this.chat = document.querySelector('.irc-chat');
    this.color = '#';
    this.lastMessage = null;
    this.inChat = true;
    this.controller = new AbortController();
    this.getColor();
    document.addEventListener('keyup', this.sendMessage);
    this.getMessages();
  }

  getColor() {
    const hexColorMarks = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
    ];
    for (let i = 0; i < 6; i += 1) {
      let oneRandomPart = Math.random() * 15;
      oneRandomPart = Math.round(oneRandomPart);
      this.color += hexColorMarks[oneRandomPart];
    }
  }

  getMessageTemplate(message) {
    const { nick, color, content, id } = message;
    const nickSpan = document.createElement('span');
    nickSpan.style.color = color;
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
    $('.irc-chat').niceScroll({
      cursorwidth: 6,
      cursoropacitymin: 0.4,
      cursorcolor: '#6e8cb6',
      cursorborder: 'none',
      cursorborderradius: 4,
    });
    this.chat.scrollTop = this.chat.scrollHeight;
    this.lastMessage = id;
  }

  async getMessages() {
    if (this.inChat) {
      try {
        const timeoutId = setTimeout(() => this.controller.abort(), 20_000);
        const responseMessages = await fetch(`/query/${this.lastMessage}`, {
          signal: this.controller.signal,
        });
        const messages = await responseMessages.json();
        console.log(messages);
        messages.forEach((element) => {
          this.getMessageTemplate(element);
        });
        this.chat.value = '';
      } catch (e) {
        const error = new Error(e);
      } finally {
        this.controller = new AbortController();
        this.getMessages();
      }
    }
  }

  sendMessage = async (e) => {
    if (this.inChat) {
      const inputValue = this.input.value;
      const emptyMessageValidator = inputValue.split('').join('');
      const { key } = e;
      const nickChangeValidator = inputValue.split(' ');
      const changeNameCommend = nickChangeValidator[0];
      if (key === 'Enter' && inputValue === '/color') this.getInputColorTemplate();
      else if (key === 'Enter' && changeNameCommend === '/nick')
        this.changeNick(nickChangeValidator[1]);
      else if (key === 'Enter' && inputValue === '/quit') this.quitChat();
      else if (key === 'Enter' && emptyMessageValidator) {
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
    }
  };

  getInputColorTemplate() {
    this.input.value = '';

    const color_wrapper = document.createElement('div');
    color_wrapper.classList.add('color_wrapper');

    const label = document.createElement('label');
    label.setAttribute('for', 'color');
    label.textContent = 'Wybierz kolor';

    const color = document.createElement('input');
    color.setAttribute('type', 'color');
    color.setAttribute('id', 'color');
    color.setAttribute('name', 'color');

    const button = document.createElement('button');
    button.classList.add('button_change_color');
    button.textContent = 'Zmień kolor';

    color_wrapper.appendChild(label);
    color_wrapper.appendChild(color);
    color_wrapper.appendChild(button);

    document.querySelector('.root-containter').appendChild(color_wrapper);

    button.addEventListener('click', this.changeColor);
  }

  changeColor = () => {
    const color = document.querySelector('#color').value;
    this.color = color;

    document.querySelector('.color_wrapper').remove();
  };
  changeNick(nick) {
    this.input.value = '';
    this.nick = nick;
  }
  quitChat() {
    this.controller.abort();
    this.inChat = false;
    this.input.value = '';
  }
}

const ircChat = new Chat();
