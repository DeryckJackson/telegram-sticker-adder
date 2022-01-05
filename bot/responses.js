const getPackNameRes = 'Please send me a name for your new pack. \n\n Can contain only english letters, digits and underscores. Must begin with a letter and can\'t contain consecutive underscores';
const getPackEmojisRes = 'Please send me which emojis you want associated with your new sticker. \n\n You can list several emoji in one message, but I recommend using no more than two per sticker.';
const getPackStickerRes = 'Please send me a sticker or an image to add as the first sticker of your new pack.';
const getPackTitleRes = 'Please send me a title for your new pack.';
const invalidEmojiRes = 'Sorry that wasn\'t just emojis, Please try again.';
const invalidPackNameRes = 'Sorry, that doesn\'t match the naming conventions. Please try again';
const invalidInputRes = 'I didn\'t understand that, please try again.';
const titleTooLongRes = 'Sorry that name is too long, please shorten it to 64 characters or less.';

module.exports = {
  getPackNameRes,
  getPackEmojisRes,
  getPackStickerRes,
  getPackTitleRes,
  invalidEmojiRes,
  invalidPackNameRes,
  invalidInputRes,
  titleTooLongRes
};
