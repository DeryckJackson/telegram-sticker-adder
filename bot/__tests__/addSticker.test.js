const StickerBot = require('../stickerBot');
const addSticker = require('../addSticker');
const c = require('../menuConstants');
const res = require('../responses');

const mockSendMessage = jest.fn();
const mockAddSticker = jest.fn();
const mockGetFile = jest.fn();
const mockAddStickerPhoto = jest.fn();
const mockResize = jest.fn();

jest.mock('../stickerBot.js', () => {
  return function () {
    return {
      sendMessage: mockSendMessage,
      addSticker: mockAddSticker,
      getFile: mockGetFile,
      addStickerWithPhoto: mockAddStickerPhoto,
      resize: mockResize
    };
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

  it('should send invalid input message', async () => {
    mockUser.menuState = c.stickerGetPackName;
    const message = {
      text: 'WRONG!'
    };

    const user = await addSticker(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, mockUser.id);
  });

  it('should send invalid emoji message', async () => {
    mockUser.menuState = c.stickerGetEmojis;
    const message = {
      text: 'WRONG!'
    };

    const user = await addSticker(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidEmoji, mockUser.id);
  });

  it('should set menuState to stickerGetSticker and send getSticker message', async () => {
    mockUser.menuState = c.stickerGetEmojis;
    const message = {
      text: '👍'
    };

    const user = await addSticker(mockUser, message);

    expect(user.menuState).toEqual(c.stickerGetSticker);
    expect(mockSendMessage).toHaveBeenCalledWith(res.getSticker, mockUser.id);
  });

  it('should send invalid input message for stickerGetEmojis state', async () => {
    mockUser.menuState = c.stickerGetEmojis;
    const message = {
      sticker: 'Wait this isnt right'
    };

    const user = await addSticker(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, mockUser.id);
  });

  it('should set menuState to stickerGetEmojis and call addSticker', async () => {
    mockUser.menuState = c.stickerGetSticker;
    const message = {
      sticker: {
        file_id: '12345'
      }
    };

    const user = await addSticker(mockUser, message);

    expect(user.menuState).toEqual(c.stickerGetEmojis);
    expect(mockAddSticker).toHaveBeenCalledWith(mockUser, message.sticker.file_id);
    expect(mockSendMessage).toHaveBeenCalledWith(res.stickerSuccess, mockUser.id);
  });

  it('should set menuState to stickerGetEmojis and call addStickerWithPhoto', async () => {
    mockUser.menuState = c.stickerGetSticker;
    const message = {
      photo: [{
        file_id: '12345'
      }]
    };

    const user = await addSticker(mockUser, message);

    expect(user.menuState).toEqual(c.stickerGetEmojis);
    expect(mockGetFile).toHaveBeenCalledWith(message.photo[0].file_id);
    expect(mockSendMessage).toHaveBeenCalledWith(res.stickerSuccess, mockUser.id);
  });

  it('should send invalid input message with invalid menuState', async () => {
    mockUser.menuState = 'this is wrong';
    const message = {
      text: 'someText'
    };

    const user = await addSticker(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, mockUser.id);
  });
});
