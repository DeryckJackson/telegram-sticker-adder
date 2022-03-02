require('dotenv').config();
const emojiRegex = require('emoji-regex');

const StickerBot = require('./stickerBot');
const res = require('./responses');
const regex = require('./regex');
const c = require('./menuConstants');

async function addAnimatedSticker(user, message) {
  const bot = new StickerBot(process.env.BOT_TOKEN);

  const { text, sticker, photo } = message;

  if (user.menuState === c.idle) {
    user.menuState = c.animatedStickerGetName;
    bot.sendMessage(res.stickerGetPackName, user.id);

    return Promise.resolve(user);
  } else if (user.menuState === c.animatedStickerGetName) {
    if (sticker && sticker.is_animated) {
      if (!regex.byStickerAdderBot.test(sticker.set_name)) {
        bot.sendMessage(res.invalidStickerPackName, user.id);
      } else {
        user.menuState = c.animatedStickerGetEmojis;
        user.packName = sticker.set_name;
        bot.sendMessage(res.getEmojis, user.id);
      }
    } else {
      bot.sendMessage(res.invalidInput, user.id);
    }

    return Promise.resolve(user);
  } else if (user.menuState === c.animatedStickerGetEmojis) {
    const eRegex = emojiRegex();

    if (sticker && sticker.is_animated) {
      const { file_id, emoji } = sticker;
      user.emojis = emoji;

      try {
        await bot.addAnimatedSticker(user, file_id);
      } catch (error) {
        throw new Error(error);
      }

      bot.sendMessage(res.stickerSuccess, user.id);

      user.emojis = '';
    } else if (text) {
      if (eRegex.test(text)) {
        user.menuState = c.animatedStickerGetSticker;
        user.emojis = text;
        bot.sendMessage(res.getSticker, user.id);
      } else {
        bot.sendMessage(res.invalidEmoji, user.id);
      }
    } else {
      bot.sendMessage(res.invalidInput, user.id);
    }

    return Promise.resolve(user);
  } else if (user.menuState === c.animatedStickerGetSticker) {
    if (sticker && sticker.is_animated) {
      try {
        const { file_id } = sticker;
        await bot.addAnimatedSticker(user, file_id);
        user.menuState = c.animatedStickerGetEmojis;
        bot.sendMessage(res.stickerSuccess, user.id);
      } catch (error) {
        throw new Error(error);
      }
    } else {
      bot.sendMessage(res.invalidInput, user.id);
    }

    return Promise.resolve(user);
  } else {
    bot.sendMessage(res.invalidInput, user.id);
    return Promise.resolve(user);
  }
}

module.exports = addAnimatedSticker;
