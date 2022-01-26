const StickerBot = require('../stickerBot');
const createPack = require('../createPack');
const c = require('../menuConstants');
const res = require('../responses');

const mockSendMessage = jest.fn();
const mockBlankUser = jest.fn();
const mockGetFile = () => { 'a file'; };
const mockCreatePackSticker = jest.fn();
const mockResize = () => { 'picbuffer'; };
const mockCreatePackPhoto = jest.fn();

jest.mock('../stickerBot.js', () => {
  return function () {
    return {
      sendMessage: mockSendMessage,
      getFile: mockGetFile,
      createPackSticker: mockCreatePackSticker,
      createPackPhoto: mockCreatePackPhoto,
      resize: mockResize,
      blankUser: mockBlankUser
    };
  };
});

describe('createPack', () => {
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

  it('should return user menu constant packGetName', async () => {
    const message = {
      text: 'mockMessage'
    };

    const user = await createPack(mockUser, message);

    expect(user.menuState).toEqual(c.packGetName);
    expect(mockSendMessage).toHaveBeenCalledWith(res.getPackName, mockUser.id);
  });

  it('should send invalid input response', async () => {
    mockUser.menuState = c.packGetName;
    const message = {
      sticker: 'this isnt right'
    };

    const user = await createPack(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, mockUser.id);
  });

  it('should send invalid pack name response', async () => {
    mockUser.menuState = c.packGetName;
    const message = {
      text: 'Invalid__pack Name'
    };

    const user = await createPack(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidPackName, mockUser.id);
  });

  it('should send getPackTitle message and set menuState to packGetTitle', async () => {
    mockUser.menuState = c.packGetName;
    const message = {
      text: 'valid_pack_Name'
    };

    const user = await createPack(mockUser, message);

    expect(user.menuState).toEqual(c.packGetTitle);
    expect(user.packName).toEqual(message.text);
    expect(mockSendMessage).toHaveBeenCalledWith(res.getPackTitle, mockUser.id);
  });

  it('should send invalid input response in the packGetTitle if statement', async () => {
    mockUser.menuState = c.packGetTitle;
    const message = {
      sticker: 'this isnt right'
    };

    const user = await createPack(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, mockUser.id);
  });

  it('should send invalid input response in the packGetTitle if statement', async () => {
    mockUser.menuState = c.packGetTitle;
    const message = {
      text: 'this is too loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooonnnnnngggggggggggggggggggggggggggggggggggggggg'
    };

    const user = await createPack(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.titleTooLong, mockUser.id);
  });

  it('should send getPackTitle message and set menuState to packGetTitle', async () => {
    mockUser.menuState = c.packGetTitle;
    const message = {
      text: 'Valid Pack Title'
    };

    const user = await createPack(mockUser, message);

    expect(user.menuState).toEqual(c.packGetEmojis);
    expect(user.packTitle).toEqual(message.text);
    expect(mockSendMessage).toHaveBeenCalledWith(res.getEmojis, mockUser.id);
  });

  it('should send invalid input response in the packGetEmojis if statement', async () => {
    mockUser.menuState = c.packGetEmojis;
    const message = {
      sticker: 'this isnt right'
    };

    const user = await createPack(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, mockUser.id);
  });

  it('should send invalid emoji response in the packGetEmojis if statement', async () => {
    mockUser.menuState = c.packGetEmojis;
    const message = {
      text: 'this isnt a emoji'
    };

    const user = await createPack(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidEmoji, mockUser.id);
  });

  it('should send packGetSticker message and set menuState to packGetSticker', async () => {
    mockUser.menuState = c.packGetEmojis;
    const message = {
      text: '👍'
    };

    const user = await createPack(mockUser, message);

    expect(user.menuState).toEqual(c.packGetSticker);
    expect(user.emojis).toEqual(message.text);
    expect(mockSendMessage).toHaveBeenCalledWith(res.getPackSticker, mockUser.id);
  });

  it('should send Success message and call createPackSticker', async () => {
    mockUser.packName = 'Foobar';
    mockUser.menuState = c.packGetSticker;
    const message = {
      sticker: {
        file_id: '12345'
      }
    };

    const user = await createPack(mockUser, message);

    expect(mockBlankUser).toHaveBeenCalled();
    expect(mockSendMessage).toHaveBeenCalledWith(res.packSuccess(mockUser.packName), mockUser.id);
    expect(mockCreatePackSticker).toHaveBeenCalledWith(mockUser, message.sticker.file_id);
  });

  it('should send Success message and call createPackPhoto', async () => {
    mockUser.packName = 'Foobar';
    mockUser.menuState = c.packGetSticker;
    const message = {
      photo: [{
        file_id: '12345'
      }]
    };

    const user = await createPack(mockUser, message);

    expect(mockBlankUser).toHaveBeenCalled();
    expect(mockSendMessage).toHaveBeenCalledWith(res.packSuccess(mockUser.packName), mockUser.id);
    expect(mockCreatePackPhoto).toHaveBeenCalledWith(mockUser, mockResize());
  });

  it('should send invalid message with menuState packGetSticker', async () => {
    mockUser.packName = 'Foobar';
    mockUser.menuState = c.packGetSticker;
    const message = {
      text: 'WRONG'
    };

    const user = await createPack(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, mockUser.id);
  });
});
