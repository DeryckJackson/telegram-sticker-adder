const StickerBot = require('../stickerBot');
const createAnimatedPack = require('../createAnimatedPack');
const c = require('../menuConstants');
const res = require('../responses');

const mockSendMessage = jest.fn();
const mockBlankUser = jest.fn();
const mockGetFile = () => { 'a file'; };
const mockCreatePackAnimated = jest.fn();

jest.mock('../stickerBot.js', () => {
  return function () {
    return {
      sendMessage: mockSendMessage,
      getFile: mockGetFile,
      createPackAnimated: mockCreatePackAnimated,
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

  it('should return user menu constant animatedGetName', async () => {
    const message = {
      text: 'mockMessage'
    };

    const user = await createAnimatedPack(mockUser, message);

    expect(user.menuState).toEqual(c.animatedGetName);
    expect(mockSendMessage).toHaveBeenCalledWith(res.getPackName, mockUser.id);
  });

  it('should send invalid input response', async () => {
    mockUser.menuState = c.animatedGetName;
    const message = {
      sticker: 'this isnt right'
    };

    const user = await createAnimatedPack(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, mockUser.id);
  });

  it('should send invalid pack name response', async () => {
    mockUser.menuState = c.animatedGetName;
    const message = {
      text: 'Invalid__pack Name'
    };

    const user = await createAnimatedPack(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidPackName, mockUser.id);
  });

  it('should send getPackTitle message and set menuState to animatedGetTitle', async () => {
    mockUser.menuState = c.animatedGetName;
    const message = {
      text: 'valid_pack_Name'
    };

    const user = await createAnimatedPack(mockUser, message);

    expect(user.menuState).toEqual(c.animatedGetTitle);
    expect(user.packName).toEqual(message.text);
    expect(mockSendMessage).toHaveBeenCalledWith(res.getPackTitle, mockUser.id);
  });

  it('should send invalid input response in the animatedGetTitle if statement', async () => {
    mockUser.menuState = c.animatedGetTitle;
    const message = {
      sticker: 'this isnt right'
    };

    const user = await createAnimatedPack(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, mockUser.id);
  });

  it('should send invalid input response in the animatedGetTitle if statement', async () => {
    mockUser.menuState = c.animatedGetTitle;
    const message = {
      text: 'this is too loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooonnnnnngggggggggggggggggggggggggggggggggggggggg'
    };

    const user = await createAnimatedPack(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.titleTooLong, mockUser.id);
  });

  it('should send getPackTitle message and set menuState to animatedGetTitle', async () => {
    mockUser.menuState = c.animatedGetTitle;
    const message = {
      text: 'Valid Pack Title'
    };

    const user = await createAnimatedPack(mockUser, message);

    expect(user.menuState).toEqual(c.animatedGetEmojis);
    expect(user.packTitle).toEqual(message.text);
    expect(mockSendMessage).toHaveBeenCalledWith(res.getEmojis, mockUser.id);
  });

  it('should send invalid input response in the animatedGetEmojis if statement', async () => {
    mockUser.menuState = c.animatedGetEmojis;
    const message = {
      sticker: 'this isnt right'
    };

    const user = await createAnimatedPack(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, mockUser.id);
  });

  it('should send invalid emoji response in the animatedGetEmojis if statement', async () => {
    mockUser.menuState = c.animatedGetEmojis;
    const message = {
      text: 'this isnt a emoji'
    };

    const user = await createAnimatedPack(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidEmoji, mockUser.id);
  });

  it('should send getAnimatedPackSticker message and set menuState to animatedGetSticker', async () => {
    mockUser.menuState = c.animatedGetEmojis;
    const message = {
      text: '👍'
    };

    const user = await createAnimatedPack(mockUser, message);

    expect(user.menuState).toEqual(c.animatedGetSticker);
    expect(user.emojis).toEqual(message.text);
    expect(mockSendMessage).toHaveBeenCalledWith(res.getAnimatedPackSticker, mockUser.id);
  });

  it('should send Success message and call createAnimatedSticker', async () => {
    mockUser.packName = 'Foobar';
    mockUser.menuState = c.animatedGetSticker;
    const message = {
      sticker: {
        file_id: '12345',
        is_animated: true
      }
    };

    const user = await createAnimatedPack(mockUser, message);

    expect(mockBlankUser).toHaveBeenCalled();
    expect(mockSendMessage).toHaveBeenCalledWith(res.packSuccess(mockUser.packName), mockUser.id);
    expect(mockCreatePackAnimated).toHaveBeenCalledWith(mockUser, message.sticker.file_id);
  });

  it('should send invalid input message when called with animatedGetSticker menuState', async () => {
    mockUser.menuState = c.animatedGetSticker;
    const message = {
      text: 'this is wrong'
    };

    const user = await createAnimatedPack(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, mockUser.id);
  });

  it('should send invalid input message when called with invalid menuState', async () => {
    mockUser.menuState = 'This is wrong';
    const message = {
      text: 'foo'
    };

    const user = await createAnimatedPack(mockUser, message);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, mockUser.id);
  });
});
