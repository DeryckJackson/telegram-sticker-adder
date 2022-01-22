const StickerBot = require('../stickerBot');
const addSticker = require('../addSticker');
const c = require('../menuConstants');
const res = require('../responses');

const mockSendMessage = jest.fn();
jest.mock('../stickerBot.js', () => {
  return function () {
    return { sendMessage: mockSendMessage };
  };
});

describe('addSticker', () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      id: 12345,
      menuState: 'idle',
      packName: '',
      packTitle: '',
      emojis: ''
    };

    jest.clearAllMocks();
  });

  it('should return user menu constant stickerGetPackName', async () => {
    const message = {
      text: 'mockMessage'
    };

    const user = await addSticker(mockUser, message);

    expect(user.menuState).toEqual(c.stickerGetPackName);
    expect(mockSendMessage).toHaveBeenCalledWith(res.stickerGetPackName, mockUser.id);
  });

  it('should call sendMessage with invalidStickerPackName response', async () => {
    mockUser.menuState = c.stickerGetPackName;
    const message = {
      sticker: {
        set_name: 'invalidName'
      }
    };

    const user = await addSticker(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidStickerPackName, mockUser.id);
  });

  it('should set menuState to stickerGetEmojis and packName', async () => {
    mockUser.menuState = c.stickerGetPackName;
    const message = {
      sticker: {
        set_name: 'name_by_StickerAdderBot'
      }
    };

    const user = await addSticker(mockUser, message);

    expect(user.menuState).toEqual(c.stickerGetEmojis);
    expect(mockSendMessage).toHaveBeenCalledWith(res.getEmojis, mockUser.id);
  });
});
