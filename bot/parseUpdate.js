require('dotenv').config();
const StickerBot = require('./stickerBot');
const { getUser, upsertUser } = require('../datastore/index');
const { createPack } = require('./regex');
const { getPackNameRes, invalidInputRes, getPackEmojisRes } = require('./responses');

async function parseUpdate(update) {
  const bot = new StickerBot(process.env.BOT_TOKEN);

  const { message } = update;
  const { from, text, sticker } = message;
  const { id } = from;

  let user;

  try {
    user = await getUser(id);
    user.userId = id;
  } catch (error) {
    console.error(error);
  }

  if (!user) {
    user = {
      userId: id,
      menuState: 'idle',
      packName: '',
      emojis: ''
    };
  }

  if (user.menuState === 'idle') {
    if (createPack.test(text)) {
      user.menuState = 'packGetName';
      bot.sendMessage(getPackNameRes, user.userId);
    } else {
      bot.sendMessage(invalidInputRes, user.userId);
    }
  }

  if (user.menuState === 'packGetName') {
    if (!text) {
      bot.sendMessage(invalidInputRes, user.userId);
    } else {
      user.menuState = 'packGetEmojis';
      user.packName = text.trim();
      bot.sendMessage(getPackEmojisRes, user.userId);
    }
  }

  try {
    const { userId, menuState, packName, emojis } = user;

    await upsertUser(userId, menuState, packName, emojis);
  } catch (error) {
    console.error(error);
  }
}

module.exports = parseUpdate;
