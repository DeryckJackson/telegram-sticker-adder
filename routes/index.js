var express = require('express');
var router = express.Router();
const axios = require('axios');

axios.defaults.baseUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

router.post(`/${process.env.BOT_TOKEN}`, (req, res, next) => {
  try {
    const userId = req.body.result[0].message.from.id;

    const text = 'Stop messaging me, I\'m not done yet';
    const body = {
      chat_id: userId,
      text
    };

    axios.post('/sendMessage', body);

    res.status(200);
  } catch (err) {
    next(error);
  }
});

module.exports = router;
