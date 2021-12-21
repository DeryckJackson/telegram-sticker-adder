require('dotenv').config();
var express = require('express');
const StickerBot = require('../bot/stickerBot');
var router = express.Router();

const bot = new StickerBot(process.env.BOT_TOKEN);

router.get('/', (req, res) => {
  res.status(200).send("Ok");
});

router.post(`/${process.env.BOT_TOKEN}`, async (req, res, next) => {
  try {
    const text = 'Stop messaging me, I\'m not done yet.';

    const { body } = req;
    const userId = body.message.from.id;

    // const createRegex = /(\/create_sticker_pack)(\s+)([a-zA-Z]+)/g;
    // switch (text) {
    //   case '/create_sticker_pack':
    // }

    const response = await bot.sendMessage(text, userId);

    res.status(200).send("Ok");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
