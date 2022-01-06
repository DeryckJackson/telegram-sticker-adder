require('dotenv').config();
const emojiRegex = require('emoji-regex');

const StickerBot = require('./stickerBot');
const { getUser, upsertUser } = require('../datastore/index');
const { createPackCommand, createPackName } = require('./regex');
const res = require('./responses');

async function parseUpdate(update) {
  const bot = new StickerBot(process.env.BOT_TOKEN);

  const { message } = update;
  const { from, text, sticker, photo } = message;
  const { id } = from;

  let user;

  try {
    user = await getUser(id);
    user.id = id;
  } catch (error) {
    console.error(error);
  }

  if (!user) {
    user = {
      id,
      menuState: 'idle',
      packName: '',
      packTitle: '',
      emojis: ''
    };
  }

  if (user.menuState === 'idle') {
    if (createPackCommand.test(text)) {
      user.menuState = 'packGetName';
      bot.sendMessage(res.getPackNameRes, user.id);
    } else {
      res.sendMessage(res.invalidInputRes, user.id);
    }
  }

  if (user.menuState === 'packGetName') {
    if (!text) {
      bot.sendMessage(res.invalidInputRes, user.id);
    } else if (!createPackName.test(text) && text.length <= 64) {
      bot.sendMessage(res.invalidPackNameRes, user.id);
    } else {
      user.menuState = 'packGetTitle';
      user.packName = text.trim();
      bot.sendMessage(res.getPackEmojisRes, user.id);
    }
  }

  if (user.menuState === 'packGetTitle') {
    if (!text) {
      bot.sendMessage(res.invalidInputRes, user.id);
    } else if (text.length > 64) {
      bot.sendMessage(res.titleTooLongRes, user.id);
    } else {
      user.menuState = 'packGetEmojis';
      user.packTitle = text;
      bot.sendMessage(res.getPackEmojisRes, user.id);
    }
  }

  if (user.menuState === 'packGetEmojis') {
    const eRegex = emojiRegex();

    if (!text) {
      bot.sendMessage(res.invalidInputRes, user.id);
    } else if (!eRegex.test(text)) {
      bot.sendMessage(res.invalidEmojiRes, user.id);
    } else {
      user.menuState = 'packGetSticker';
      user.emojis = text;
      bot.sendMessage(res.getPackStickerRes, user.id);
    }
  }

  if (user.menuState === 'packGetSticker') {
    if (sticker && !photo) {
      const { file_id } = sticker;

      await bot.createPackSticker(user, file_id);

      bot.sendMessage(
        `Success! Your new pack can be found here. \n\n t.me/addstickers/${user.packName}_by_StickerAdderBot/`,
        user.id
      );

      user = {
        id: user.id,
        menuState: 'idle',
        packName: '',
        packTitle: '',
        emojis: ''
      };
    } else if (!sticker && photo) {
      const fileId = photo[photo.length - 1].file_id;

      const pic = await bot.getFile(fileId);
      const picBuffer = await bot.resize(pic);
      await bot.createPackPhoto(user, picBuffer);

      bot.sendMessage(
        `Success! Your new pack can be found here. \n\n t.me/addstickers/${user.packName}_by_StickerAdderBot/`,
        user.id
      );

      user = {
        id: user.id,
        menuState: 'idle',
        packName: '',
        packTitle: '',
        emojis: ''
      };
    }
  }

  try {
    await upsertUser(user);
  } catch (error) {
    console.error(error);
  }
}

module.exports = parseUpdate;
