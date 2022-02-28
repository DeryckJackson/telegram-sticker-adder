const addAnimatedStickerCommand = /\/(add_animated_sticker)/;
const addStickerCommand = /(\/add_sticker)/;
const byStickerAdderBot = /(_by_StickerAdderBot)/;
const createAnimatedPackCommand = /(\/create_animated_pack)/;
const createPackCommand = /(\/create_sticker_pack)/;
const createPackName = /^_?[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*_?$/;
const cancelCommand = /(\/cancel)/;

module.exports = {
  addAnimatedStickerCommand,
  addStickerCommand,
  byStickerAdderBot,
  cancelCommand,
  createAnimatedPackCommand,
  createPackCommand,
  createPackName
};
