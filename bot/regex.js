const createPackCommand = /(\/create_sticker_pack)/;
const createPackName = /^_?[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*_?$/;
const addStickerCommand = /(\/add_sticker)/;
const createAnimatedPackCommand = /(\/create_animated_pack)/;
const cancelCommand = /(\/cancel)/;
const byStickerAdderBot = /(_by_StickerAdderBot)/;

module.exports = {
  addStickerCommand,
  byStickerAdderBot,
  cancelCommand,
  createAnimatedPackCommand,
  createPackCommand,
  createPackName
};
