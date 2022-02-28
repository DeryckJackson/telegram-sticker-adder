const cancel = "Ok, canceling last command. 💤💤";
const getAnimatedPackSticker = "Please send me an animated sticker to add as the first sticker of your new pack.";
const getAnimatedSticker = "Please send me an animated sticker for your new sticker";
const getEmojis = "Please send me which emojis you want associated with your new sticker. \n\n You can list several emoji in one message, but I recommend using no more than two per sticker.";
const getPackName = "Please send me a name for your new pack. \n\n Can contain only english letters, digits and underscores. Must begin with a letter and can not contain consecutive underscores";
const getPackSticker = "Please send me a sticker or an image to add as the first sticker of your new pack.";
const getPackTitle = "Please send me a title for your new pack.";
const getSticker = "Please send me a sticker or a photo for your new sticker.";
const invalidEmoji = "Sorry that wasn't just emojis, Please try again.";
const invalidPackName = "Sorry, that doesn't match the naming conventions. Please try again";
const invalidStickerPackName = "I can't use that pack, please send me a sticker from a pack I've created for you.";
const invalidInput = "I didn't understand that, please try again.";
const stickerGetPackName = "Please send me a sticker from the pack you want to add to. It needs to be a pack I have created for you.";
const stickerSuccess = "Success! If you want to add another sticker send me emojis to associate with it or you can just send me another sticker.";
const titleTooLong = "Sorry that name is too long, please shorten it to 64 characters or less.";
const packSuccess = (packName) => {
  return `Success! Your new pack can be found here. \n\n t.me/addstickers/${packName}_by_StickerAdderBot/`;
};

module.exports = {
  cancel,
  getAnimatedPackSticker,
  getEmojis,
  getPackName,
  getPackSticker,
  getPackTitle,
  getSticker,
  invalidEmoji,
  invalidStickerPackName,
  invalidPackName,
  invalidInput,
  packSuccess,
  stickerGetPackName,
  stickerSuccess,
  titleTooLong
};
