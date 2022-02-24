require('dotenv').config();
var express = require('express');
const parseUpdate = require('../bot/parseUpdate');
const StickerBot = require('../bot/stickerBot');
const { getUser, upsertUser } = require('../datastore/index');
var router = express.Router();

const bot = new StickerBot(process.env.BOT_TOKEN);

router.get('/', async (req, res) => {
  res.status(200).send('Ok');
});

router.post('/', (req, res) => {
  try {
    const { body } = req;

    parseUpdate(body);

    res.status(200).send("Ok");
  } catch (err) {
    next(err);
  }
});

router.post(`/${process.env.BOT_TOKEN}`, (req, res, next) => {
  try {
    const { body } = req;

    parseUpdate(body);

    res.status(200).send("Ok");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
