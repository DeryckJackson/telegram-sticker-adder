const createPackCommand = /(\/create_sticker_pack)/g;
const createPackName = /^_?[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*_?$/g;

module.exports = {
  createPackCommand,
  createPackName
};
