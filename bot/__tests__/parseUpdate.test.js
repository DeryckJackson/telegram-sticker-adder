const parseUpdate = require('../parseUpdate');
const StickerBot = require('../stickerBot');
const res = require('../responses');

const mockSendMessage = jest.fn();
const mockBlankUser = jest.fn();
const mockCreatePackSticker = jest.fn();
const mockCreatePackPhoto = jest.fn();

jest.mock('../stickerBot.js', () => {
  return function () {
    return {
      sendMessage: mockSendMessage,
      createPackSticker: mockCreatePackSticker,
      createPackPhoto: mockCreatePackPhoto,
      blankUser: mockBlankUser
    };
  };
});
