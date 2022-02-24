const FormData = require('form-data');

class StickerBot {
  #axios = require('axios');
  #sharp = require('sharp');

  constructor(token) {
    this.token = token;
    this.#axios.defaults.baseURL = `https://api.telegram.org/bot${token}`;
  }

  async addAnimatedSticker(user, fileId) {
    const { id, packName, packTitle, emojis } = user;

    const tgsBuffer = await this.getFile(fileId);

    const formData = new FormData();

    formData.append('user_id', id);
    formData.append('name', packName);
    formData.append('tgs_sticker', tgsBuffer, 'file.tgs');
    formData.append('emojis', emojis);

    try {
      await this.#axios.post(`/addStickerToSet`, formData, {
        headers: formData.getHeaders()
      });
    } catch (error) {
      console.error(error.response.data);
      this.sendMessage(error.response.data.description, id);
      throw new Error(error.response.data.description);
    }

    return Promise.resolve(true);
  }

  async addSticker(user, fileId) {
    const { id, packName, emojis } = user;

    const body = {
      user_id: id,
      name: packName,
      emojis,
      png_sticker: fileId
    };

    try {
      await this.#axios.post('/addStickerToSet', body);
    } catch (error) {
      this.sendMessage(error.response.data.description, id);
      console.error(error.response.data);
      throw new Error(error.response.data.description);
    }

    return Promise.resolve(true);
  }

  async addStickerWithPhoto(user, picBuffer) {
    const { id, packName, emojis } = user;
    const formData = new FormData();

    formData.append('user_id', id);
    formData.append('name', packName);
    formData.append('png_sticker', picBuffer, 'file.png');
    formData.append('emojis', emojis);

    try {
      await this.#axios.post(`/addStickerToSet`, formData, {
        headers: formData.getHeaders()
      });
    } catch (error) {
      this.sendMessage(error.response.data.description, id);
      console.error(error.response.data);
      throw new Error(error.response.data.description);
    }

    return Promise.resolve(true);
  }

  blankUser(id) {
    return {
      id,
      menuState: 'idle',
      packName: '',
      packTitle: '',
      emojis: ''
    };
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
      this.sendMessage(error.response.data.description, id);
      console.error(error.response.data);
      throw new Error(error.response.data.description);
    }

    return Promise.resolve(true);
  }

  async createPackSticker(user, fileId) {
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
      console.error(error.response.data);
      this.sendMessage(error.response.data.description, id);
      throw new Error(error.response.data.description);
    }

    return Promise.resolve(true);
  }

  async createPackAnimated(user, fileId) {
    const { id, packName, packTitle, emojis } = user;

    const tgsBuffer = await this.getFile(fileId);

    const formData = new FormData();

    formData.append('user_id', id);
    formData.append('name', `${packName}_by_StickerAdderBot`);
    formData.append('title', packTitle);
    formData.append('tgs_sticker', tgsBuffer, 'file.tgs');
    formData.append('emojis', emojis);

    try {
      await this.#axios.post(`/createNewStickerSet`, formData, {
        headers: formData.getHeaders()
      });
    } catch (error) {
      console.error(error.response.data);
      this.sendMessage(error.response.data.description, id);
      throw new Error(error.response.data.description);
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
      console.error(error.response.data);
      throw new Error(error.response.data.description);
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
