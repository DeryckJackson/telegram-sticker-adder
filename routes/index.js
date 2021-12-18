require('dotenv').config();
var express = require('express');
var router = express.Router();
const axios = require('axios');

axios.defaults.baseURL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

router.post(`/${process.env.BOT_TOKEN}`, async (req, res, next) => {
  try {
    const userId = req.body.result[0].message.from.id;

    const text = 'Stop messaging me, I\'m not done yet.';
    const body = {
      chat_id: userId,
      text
    };

    const response = await axios.post('/sendMessage', body);

    res.status(200).send("Ok");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
