require('dotenv').config();
const emojiRegex = require('emoji-regex');

const StickerBot = require('./stickerBot');
const res = require('./responses');
const regex = require('./regex');
const c = require('./menuConstants');

async function addSticker(user, message) {
  const bot = new StickerBot(process.env.BOT_TOKEN);

  const { text, sticker, photo } = message;

  if (user.menuState === c.idle) {
    user.menuState = c.stickerGetPackName;
    bot.sendMessage(res.stickerGetPackName, user.id);

    return Promise.resolve(user);
  } else if (user.menuState === c.stickerGetPackName) {
    if (sticker) {
      if (!regex.byStickerAdderBot.test(sticker.set_name)) {
        bot.sendMessage(res.invalidStickerPackName, user.id);
      } else {
        user.menuState = c.stickerGetEmojis;
        user.packName = sticker.set_name;
        bot.sendMessage(res.getEmojis, user.id);
      }
    } else {
      bot.sendMessage(res.invalidInput, user.id);
    }

    return Promise.resolve(user);
  } else if (user.menuState === c.stickerGetEmojis) {
    const eRegex = emojiRegex();
    if (text) {
      if (eRegex.test(text)) {
        user.menuState = c.stickerGetSticker;
        user.emojis = text;
        bot.sendMessage(res.getSticker, user.id);
      } else {
        bot.sendMessage(res.invalidEmoji, user.id);
      }
    } else {
      bot.sendMessage(res.invalidInput, user.id);
    }

    return Promise.resolve(user);
  } else if (user.menuState === c.stickerGetSticker) {
    if (sticker) {
      try {
        const { file_id } = sticker;
        await bot.addSticker(user, file_id);
        user.menuState = c.stickerGetEmojis;
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

      user.menuState = c.stickerGetEmojis;
      user.emojis = '';
      bot.sendMessage(res.stickerSuccess, user.id);
    } else {
      bot.sendMessage(res.invalidInput, user.id);
    }

    return Promise.resolve(user);
  } else {
    bot.sendMessage(res.invalidInput, user.id);
    return Promise.resolve(user);
  }
}

module.exports = addSticker;
