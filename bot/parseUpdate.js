require('dotenv').config();

const StickerBot = require('./stickerBot');
const { getUser, upsertUser } = require('../datastore/index');
const regex = require('./regex');
const createPack = require('./createPack');
const addSticker = require('./addSticker');
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
    user = bot.blankUser(user.id);
  }

  if (regex.cancelCommand.test(message.text)) {
    bot.sendMessage(res.cancel, user.id);

    user = bot.blankUser(user.id);
  } else if (user.menuState.slice(0, 4) === 'pack' || regex.createPackCommand.test(message.text)) {
    try {
      user = await createPack(user, message);
    } catch (error) {
      console.error(error);
    }
  } else if (user.menuState.slice(0, 7) === 'sticker' || regex.addStickerCommand.test(message.text)) {
    try {
      user = await addSticker(user, message);
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
