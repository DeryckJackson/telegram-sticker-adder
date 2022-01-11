require('dotenv').config();
const emojiRegex = require('emoji-regex');

const StickerBot = require('./stickerBot');
const res = require('./responses');
const regex = require('./regex');

async function addSticker(user, message) {
  const bot = new StickerBot(process.env.BOT_TOKEN);

  const { text, sticker, photo } = message;

  if (user.menuState === 'idle') {
    user.menuState = 'stickerGetPackName';
    bot.sendMessage(res.stickerGetPackName, user.id);
    return Promise.resolve(user);
  }

  if (user.menuState === 'stickerGetPackName') {
    if (!regex.byStickerAdderBot.test(sticker.set_name)) {
      bot.sendMessage(res.invalidStickerPackName, user.id);
    } else if (sticker) {
      user.menuState = 'stickerGetEmojis';
      user.packName = sticker.set_name;
      bot.sendMessage(res.getEmojis, user.id);
    } else {
      console.log('26');
      bot.sendMessage(res.invalidInput, user.id);
    }
    return Promise.resolve(user);
  }

  const eRegex = emojiRegex();

  if (user.menuState === 'stickerGetEmojis') {
    if (eRegex.test(text)) {
      user.menuState = 'stickerGetSticker';
      user.emojis = text;
      bot.sendMessage(res.getSticker, user.id);
    } else if (!eRegex.test(text)) {
      bot.sendMessage(res.invalidEmoji, user.id);
    } else {
      bot.sendMessage(res.invalidInput, user.id);
    }
    return Promise.resolve(user);
  }

  if (user.menuState === 'stickerGetSticker') {
    if (sticker) {
      try {
        const { file_id } = sticker;
        await bot.addSticker(user, file_id);
        user.menuState = 'stickerGetEmojis';
        bot.sendMessage(res.stickerSuccess, user.id);
      } catch (error) {
        throw new Error(error);
      }
    } else if (photo) {
      const fileId = photo[photo.length - 1].file_id;
      let pic;
      let picBuffer;

      try {
        pic = await bot.getFile(fileId);
      } catch (error) {
        throw new Error(error);
      }
      picBuffer = await bot.resize(pic);
      try {
        await bot.addStickerWithPhoto(user, picBuffer);
      } catch (error) {
        throw new Error(error);
      }

      user.menuState = 'stickerGetEmojis';
      user.emojis = '';
      bot.sendMessage(res.stickerSuccess, user.id);
    } else {
      bot.sendMessage(res.invalidInput, user.id);
    }
    return Promise.resolve(user);
  }
}

module.exports = addSticker;
