require('dotenv').config();

const StickerBot = require('./stickerBot');
const { getUser, upsertUser } = require('../datastore/index');
const { createPackCommand, createPackName } = require('./regex');
const createPack = require('./createPack');
const res = require('./responses');

async function parseUpdate(update) {
  const bot = new StickerBot(process.env.BOT_TOKEN);

  const { message } = update;
  const { from } = message;
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

  if (user.menuState.slice(0, 4) === 'pack' || createPackCommand.test(message.text)) {
    try {
      user = await createPack(user, message);
    } catch (error) {
      console.error(error);
    }
  } else {
    bot.sendMessage(res.invalidInput, user.id);
  }

  try {
    await upsertUser(user);
  } catch (error) {
    console.error(error);
  }
}

module.exports = parseUpdate;
