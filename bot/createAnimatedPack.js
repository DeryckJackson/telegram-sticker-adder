require('dotenv').config();
const emojiRegex = require('emoji-regex');

const StickerBot = require('./stickerBot');
const { createPackCommand, createPackName } = require('./regex');
const res = require('./responses');
const c = require('./menuConstants');

async function createAnimatedPack(user, message) {
  const bot = new StickerBot(process.env.BOT_TOKEN);

  const { text, sticker, photo } = message;

  if (user.menuState === c.idle) {
    user.menuState = c.animatedPackGetName;
    bot.sendMessage(res.getPackName, user.id);

    return Promise.resolve(user);
  } else if (user.menuState === c.animatedPackGetName) {
    if (!text) {
      bot.sendMessage(res.invalidInput, user.id);
    } else if (!createPackName.test(text) && text.length <= 64) {
      bot.sendMessage(res.invalidPackName, user.id);
    } else {
      user.menuState = c.animatedPackGetTitle;
      user.packName = text.trim();
      bot.sendMessage(res.getPackTitle, user.id);
    }

    return Promise.resolve(user);
  } else if (user.menuState === c.animatedPackGetTitle) {
    if (!text) {
      bot.sendMessage(res.invalidInput, user.id);
    } else if (text.length > 64) {
      bot.sendMessage(res.titleTooLong, user.id);
    } else {
      user.menuState = c.animatedPackGetEmojis;
      user.packTitle = text;
      bot.sendMessage(res.getEmojis, user.id);
    }

    return Promise.resolve(user);
  } else if (user.menuState === c.animatedPackGetEmojis) {
    const eRegex = emojiRegex();

    if (!text) {
      bot.sendMessage(res.invalidInput, user.id);
    } else if (!eRegex.test(text)) {
      bot.sendMessage(res.invalidEmoji, user.id);
    } else {
      user.menuState = c.animatedPackGetSticker;
      user.emojis = text;
      bot.sendMessage(res.getAnimatedPackSticker, user.id);
    }

    return Promise.resolve(user);
  } else if (user.menuState === c.animatedPackGetSticker) {
    if (sticker && sticker.is_animated) {
      const { file_id } = sticker;

      try {
        await bot.createPackAnimated(user, file_id);
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
  } else {
    bot.sendMessage(res.invalidInput, user.id);
    return Promise.resolve(user);
  }
}

module.exports = createAnimatedPack;
