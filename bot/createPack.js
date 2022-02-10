require('dotenv').config();
const emojiRegex = require('emoji-regex');

const StickerBot = require('./stickerBot');
const { createPackCommand, createPackName } = require('./regex');
const res = require('./responses');
const c = require('./menuConstants');

async function createPack(user, message) {
  const bot = new StickerBot(process.env.BOT_TOKEN);

  const { text, sticker, photo } = message;

  if (user.menuState === c.idle) {
    user.menuState = c.packGetName;
    bot.sendMessage(res.getPackName, user.id);

    return Promise.resolve(user);
  } else if (user.menuState === c.packGetName) {
    if (!text) {
      bot.sendMessage(res.invalidInput, user.id);
    } else if (!createPackName.test(text) && text.length <= 64) {
      bot.sendMessage(res.invalidPackName, user.id);
    } else {
      user.menuState = c.packGetTitle;
      user.packName = text.trim();
      bot.sendMessage(res.getPackTitle, user.id);
    }

    return Promise.resolve(user);
  } else if (user.menuState === c.packGetTitle) {
    if (!text) {
      bot.sendMessage(res.invalidInput, user.id);
    } else if (text.length > 64) {
      bot.sendMessage(res.titleTooLong, user.id);
    } else {
      user.menuState = c.packGetEmojis;
      user.packTitle = text;
      bot.sendMessage(res.getEmojis, user.id);
    }

    return Promise.resolve(user);
  } else if (user.menuState === c.packGetEmojis) {
    const eRegex = emojiRegex();

    if (!text) {
      bot.sendMessage(res.invalidInput, user.id);
    } else if (!eRegex.test(text)) {
      bot.sendMessage(res.invalidEmoji, user.id);
    } else {
      user.menuState = c.packGetSticker;
      user.emojis = text;
      bot.sendMessage(res.getPackSticker, user.id);
    }

    return Promise.resolve(user);
  } else if (user.menuState === c.packGetSticker) {
    if (sticker) {
      const { file_id } = sticker;

      try {
        await bot.createPackSticker(user, file_id);
      } catch (error) {
        throw new Error(error);
      }

      bot.sendMessage(res.packSuccess(user.packName), user.id);

      user = bot.blankUser(user.id);
      return Promise.resolve(user);
    } else if (photo) {
      let pic;
      const fileId = photo[photo.length - 1].file_id;

      try {
        pic = await bot.getFile(fileId);
      } catch (error) {
        throw new Error(error);
      }
      const picBuffer = await bot.resize(pic);
      try {
        await bot.createPackPhoto(user, picBuffer);
      } catch (error) {
        throw new Error(error);
      }

      bot.sendMessage(res.packSuccess(user.packName), user.id);

      user = bot.blankUser(user.id);
      return Promise.resolve(user);
    } else {
      bot.sendMessage(res.invalidInput, user.id);
      return Promise.resolve(user);
    }
  }
}

module.exports = createPack;
