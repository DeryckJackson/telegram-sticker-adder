const createPackCommand = /(\/create_sticker_pack)/g;
const createPackName = /^_?[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*_?$/g;
const addStickerCommand = /(\/add_sticker)/g;
const cancelCommand = /(\/cancel)/g;
const byStickerAdderBot = /(_by_StickerAdderBot)/g;

module.exports = {
  addStickerCommand,
  byStickerAdderBot,
  cancelCommand,
  createPackCommand,
  createPackName
};
