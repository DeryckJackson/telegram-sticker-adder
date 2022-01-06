const getPackName = 'Please send me a name for your new pack. \n\n Can contain only english letters, digits and undersco. Must begin with a letter and can\'t contain consecutive undersco';
const getPackEmojis = 'Please send me which emojis you want associated with your new sticker. \n\n You can list several emoji in one message, but I recommend using no more than two per sticker.';
const getPackSticker = 'Please send me a sticker or an image to add as the first sticker of your new pack.';
const getPackTitle = 'Please send me a title for your new pack.';
const invalidEmoji = 'Sorry that wasn\'t just emojis, Please try again.';
const invalidPackName = 'Sorry, that doesn\'t match the naming conventions. Please try again';
const invalidInput = 'I didn\'t understand that, please try again.';
const titleTooLong = 'Sorry that name is too long, please shorten it to 64 characters or less.';

module.exports = {
  getPackName,
  getPackEmojis,
  getPackSticker,
  getPackTitle,
  invalidEmoji,
  invalidPackName,
  invalidInput,
  titleTooLong
};
