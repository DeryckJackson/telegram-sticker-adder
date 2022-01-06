const FormData = require('form-data');

class StickerBot {
  #axios = require('axios');
  #sharp = require('sharp');

  constructor(token) {
    this.token = token;
    this.#axios.defaults.baseURL = `https://api.telegram.org/bot${token}`;
  }

  async createPackPhoto(user, picBuffer) {
    const { id, packName, packTitle, emojis } = user;
    const formData = new FormData();

    formData.append('user_id', id);
    formData.append('name', `${packName}_by_StickerAdderBot`);
    formData.append('title', packTitle);
    formData.append('png_sticker', picBuffer, 'file.png');
    formData.append('emojis', emojis);

    try {
      await this.#axios.post(`/createNewStickerSet`, formData, {
        headers: formData.getHeaders()
      });
    } catch (error) {
      console.error(error);
    }

    return Promise.resolve(true);
  }

  async createPackSticker(user, fileId) {
    const { id, packName, packTitle, emojis } = user;

    const body = {
      user_id: id,
      name: `${packName}_by_StickerAdderBot`,
      title: packTitle,
      emojis,
      png_sticker: fileId
    };

    try {
      await this.#axios.post(`/createNewStickerSet`, body);
    } catch (error) {
      console.error(error);
    }

    return Promise.resolve(true);
  }

  async sendMessage(msg, id) {
    const body = {
      chat_id: id,
      text: msg
    };

    try {
      return await this.#axios.post('/sendMessage', body);
    } catch (error) {
      console.error(error);
    }
  }

  async getFile(fileId) {
    const body = {
      file_id: fileId
    };

    try {
      const response = await this.#axios.post('/getFile', body);
      const { data } = response;
      const { result } = data;
      const { file_path } = result;

      return await this.#axios({
        method: 'get',
        url: `https://api.telegram.org/file/bot${this.token}/${file_path}`,
        responseType: 'arraybuffer'
      }).then(response => {
        return new Promise((resolve, reject) => {
          resolve(Buffer.from(response.data, 'binary'));
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  async resize(file) {
    const image = await this.#sharp(file);
    const metadata = await image.metadata();

    if (metadata.height > metadata.width) {
      return image
        .resize({ height: 512 })
        .toFormat('png')
        .toBuffer();
    } else {
      return image
        .resize({ width: 512 })
        .toFormat('png')
        .toBuffer();
    }
  }
}

module.exports = StickerBot;
