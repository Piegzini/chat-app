// 5 second timeout:

class Chat {
  constructor() {
    this.input = document.querySelector('.irc-input');
    this.chat = document.querySelector('.irc-chat');

    document.addEventListener('keyup', sendMessage);
    this.sendQuery();
  }

  async sendQuery() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const responseMessage = await fetch('/query', { signal: controller.signal });
      const { content } = await responseMessage.json();
      this.chat.innerHTML += `<p>${content}</p>`;
      this.chat.scrollTop = this.chat.scrollHeight;
    } catch (e) {
      const error = new Error(e);
      console.log(error);
    } finally {
      this.sendQuery();
    }
  }

  sendMessage = async (e) => {
    const inputValue = input.value;
    const emptyMessageValidator = inputValue.split('').join('');
    const { key } = e;

    if (key === 'Enter' && emptyMessageValidator) {
      const message = { content: inputValue };
      const parsedMessage = JSON.stringify(message);
      const response = await fetch('/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: parsedMessage,
      });
      input.value = '';
    }
  };
}
