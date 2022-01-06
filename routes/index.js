require('dotenv').config();
var express = require('express');
const parseUpdate = require('../bot/parseUpdate');
const StickerBot = require('../bot/stickerBot');
const { getUser, upsertUser } = require('../datastore/index');
var router = express.Router();

const bot = new StickerBot(process.env.BOT_TOKEN);

router.get('/', async (req, res) => {
  const { id } = req.body;

  const user = await getUser(id);

  res.status(200).send(user);
});

router.post(`/${process.env.BOT_TOKEN}`, async (req, res, next) => {
  try {
    // const text = 'Stop messaging me, I\'m not done yet.';

    const { body } = req;

    parseUpdate(body);

    res.status(200).send("Ok");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
