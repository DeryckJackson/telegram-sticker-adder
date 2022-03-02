const StickerBot = require('../stickerBot');
const addAnimatedSticker = require('../addAnimatedSticker');
const c = require('../menuConstants');
const res = require('../responses');

const mockSendMessage = jest.fn();
const mockAddAnimatedSticker = jest.fn();
const mockGetFile = jest.fn();

jest.mock('../stickerBot.js', () => {
  return function () {
    return {
      sendMessage: mockSendMessage,
      addAnimatedSticker: mockAddAnimatedSticker,
      getFile: mockGetFile,
    };
  };
});

describe('addAnimatedSticker', () => {
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

  it('should return user menu constant animatedStickerGetName', async () => {
    const message = {
      text: 'mockMessage'
    };

    const user = await addAnimatedSticker(mockUser, message);

    expect(user.menuState).toEqual(c.animatedStickerGetName);
    expect(mockSendMessage).toHaveBeenCalledWith(res.stickerGetPackName, mockUser.id);
  });

  it('should call sendMessage with invalidStickerPackName response', async () => {
    mockUser.menuState = c.animatedStickerGetName;
    const message = {
      sticker: {
        set_name: 'invalidName',
        is_animated: true
      }
    };

    const user = await addAnimatedSticker(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidStickerPackName, mockUser.id);
  });

  it('should set menuState to animatedStickerGetEmoji and set packName', async () => {
    mockUser.menuState = c.animatedStickerGetName;
    const message = {
      sticker: {
        set_name: 'name_by_StickerAdderBot',
        is_animated: true
      }
    };

    const user = await addAnimatedSticker(mockUser, message);

    expect(user.menuState).toEqual(c.animatedStickerGetEmojis);
    expect(user.packName).toEqual(message.sticker.set_name);
    expect(mockSendMessage).toHaveBeenCalledWith(res.getEmojis, mockUser.id);
  });

  it('should send invalid emoji message', async () => {
    mockUser.menuState = c.animatedStickerGetEmojis;
    const message = {
      text: 'WRONG!'
    };

    const user = await addAnimatedSticker(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidEmoji, mockUser.id);
  });

  it('should set menuState to animatedStickerGetEmojis and send getSticker message', async () => {
    mockUser.menuState = c.animatedStickerGetEmojis;
    const message = {
      text: '👍'
    };

    const user = await addAnimatedSticker(mockUser, message);

    expect(user.menuState).toEqual(c.animatedStickerGetSticker);
    expect(mockSendMessage).toHaveBeenCalledWith(res.getSticker, mockUser.id);
  });

  it('should call bot method addAnimatedSticker after recieving a sticker', async () => {
    mockUser.menuState = c.animatedStickerGetEmojis;
    const message = {
      sticker: {
        file_id: '12345',
        emoji: '👍',
        is_animated: true
      }
    };

    const user = await addAnimatedSticker(mockUser, message);

    expect(mockAddAnimatedSticker).toHaveBeenCalledWith(user, message.sticker.file_id);
    expect(mockSendMessage).toHaveBeenCalledWith(res.stickerSuccess, mockUser.id);
  });

  it('should send invalid input message for animatedStickerGetEmojis state', async () => {
    mockUser.menuState = c.animatedStickerGetEmojis;
    const message = {
      sticker: null
    };

    const user = await addAnimatedSticker(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, mockUser.id);
  });

  it('should set menuState to animatedStickerGetEmojis and call addAnimatedSticker', async () => {
    mockUser.menuState = c.animatedStickerGetSticker;
    const message = {
      sticker: {
        file_id: '12345',
        is_animated: true
      }
    };

    const user = await addAnimatedSticker(mockUser, message);

    expect(user.menuState).toEqual(c.animatedStickerGetEmojis);
    expect(mockAddAnimatedSticker).toHaveBeenCalledWith(mockUser, message.sticker.file_id);
    expect(mockSendMessage).toHaveBeenCalledWith(res.stickerSuccess, mockUser.id);
  });

  it('should set send invalid input with menuState animatedStickerGetSticker', async () => {
    mockUser.menuState = c.animatedStickerGetSticker;
    const message = {
      text: 'invalid'
    };

    const user = await addAnimatedSticker(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, mockUser.id);
  });

  it('should send invalid input message with invalid menuState', async () => {
    mockUser.menuState = 'this is wrong';
    const message = {
      text: 'someText'
    };

    const user = await addAnimatedSticker(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, mockUser.id);
  });
});
