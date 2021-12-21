class StickerBot {
  #axios = require('axios');

  constructor(token) {
    this.token = token;
    this.#axios.defaults.baseURL = `https://api.telegram.org/bot${token}`;
  }

  async sendMessage(msg, id) {
    const body = {
      chat_id: id,
      text: msg
    };

    try {
      const response = await this.#axios.post('/sendMessage', body);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = StickerBot;
