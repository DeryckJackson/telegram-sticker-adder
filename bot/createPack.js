require('dotenv').config();
const emojiRegex = require('emoji-regex');

const StickerBot = require('./stickerBot');
const { createPackCommand, createPackName } = require('./regex');
const res = require('./responses');

async function createPack(user, message) {
  const bot = new StickerBot(process.env.BOT_TOKEN);

  const { from, text, sticker, photo } = message;
  const { id } = from;

  if (user.menuState === 'idle') {
    if (createPackCommand.test(text)) {
      user.menuState = 'packGetName';
      bot.sendMessage(res.getPackName, user.id);
    } else {
      bot.sendMessage(res.invalidInput, user.id);
    }
  }

  if (user.menuState === 'packGetName') {
    if (!text) {
      bot.sendMessage(res.invalidInput, user.id);
    } else if (!createPackName.test(text) && text.length <= 64) {
      bot.sendMessage(res.invalidPackName, user.id);
    } else {
      user.menuState = 'packGetTitle';
      user.packName = text.trim();
      bot.sendMessage(res.getPackEmojis, user.id);
    }
  }

  if (user.menuState === 'packGetTitle') {
    if (!text) {
      bot.sendMessage(res.invalidInput, user.id);
    } else if (text.length > 64) {
      bot.sendMessage(res.titleTooLong, user.id);
    } else {
      user.menuState = 'packGetEmojis';
      user.packTitle = text;
      bot.sendMessage(res.getPackEmojis, user.id);
    }
  }

  if (user.menuState === 'packGetEmojis') {
    const eRegex = emojiRegex();

    if (!text) {
      bot.sendMessage(res.invalidInput, user.id);
    } else if (!eRegex.test(text)) {
      bot.sendMessage(res.invalidEmoji, user.id);
    } else {
      user.menuState = 'packGetSticker';
      user.emojis = text;
      bot.sendMessage(res.getPackSticker, user.id);
    }
  }

  if (user.menuState === 'packGetSticker') {
    if (sticker && !photo) {
      const { file_id } = sticker;

      try {
        await bot.createPackSticker(user, file_id);
      } catch (error) {
        throw new Error(error);
      }

      bot.sendMessage(
        `Success! Your new pack can be found here. \n\n t.me/addstickers/${user.packName}_by_StickerAdderBot/`,
        user.id
      );

      user = bot.blankUser(user.id);
    } else if (!sticker && photo) {
      const fileId = photo[photo.length - 1].file_id;

      try {
        const pic = await bot.getFile(fileId);
      } catch (error) {
        throw new Error(error);
      }
      const picBuffer = await bot.resize(pic);
      try {
        await bot.createPackPhoto(user, picBuffer);
      } catch (error) {
        throw new Error(error);
      }

      bot.sendMessage(
        `Success! Your new pack can be found here. \n\n t.me/addstickers/${user.packName}_by_StickerAdderBot/`,
        user.id
      );

      user = bot.blankUser(user.id);
    }
  }

  return Promise.resolve(user);
}

module.exports = createPack;
