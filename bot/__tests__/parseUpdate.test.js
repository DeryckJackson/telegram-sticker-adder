const StickerBot = require('../stickerBot');
const createAnimatedPack = require('../createAnimatedPack');
const { getUser, upsertUser } = require('../../datastore/index');
const createPack = require('../createPack');
const addSticker = require('../addSticker');
const c = require('../menuConstants');
const res = require('../responses');
const parseUpdate = require('../parseUpdate');

let mockUser;
const mockSendMessage = jest.fn();
const mockBlankUser = jest.fn((id) => {
  return {
    id,
    menuState: 'idle',
    packName: '',
    packTitle: '',
    emojis: ''
  };
});
const mockCreateAnimatedPack = jest.fn();
const mockUpsertUser = jest.fn();

jest.mock('../stickerBot.js', () => {
  return function () {
    return {
      sendMessage: mockSendMessage,
      createAnimatedPack: mockCreateAnimatedPack,
      blankUser: mockBlankUser
    };
  };
});

jest.mock('../../datastore/index', () => {
  return {
    getUser: (id) => {
      mockUser.id = id;
      return mockUser;
    },
    upsertUser: () => mockUpsertUser
  };
});

const mockCreatePack = jest.fn();

jest.mock('../createPack');
jest.mock('../addSticker');
jest.mock('../createAnimatedPack');

describe('parseUpdate', () => {

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

  it('should generate blank user and send invalid input message', async () => {
    mockUser = null;
    const update = {
      message: {
        sticker: 'foobar',
        from: {
          id: 12345
        }
      }
    };

    const user = await parseUpdate(update);

    expect(mockSendMessage).toHaveBeenCalledWith(res.invalidInput, update.message.from.id);
    expect(mockBlankUser).toHaveBeenCalledTimes(1);
  });

  it('should should generate blankUser and run cancel command if block', async () => {
    const update = {
      message: {
        text: '/cancel',
        from: {
          id: 12345
        }
      }
    };

    const user = await parseUpdate(update);

    expect(mockSendMessage).toHaveBeenCalledWith(res.cancel, update.message.from.id);
    expect(mockBlankUser).toHaveBeenCalledTimes(1);
  });

  it('should call createPack function', async () => {
    createPack.mockImplementation();
    const update = {
      message: {
        text: '/create_sticker_pack',
        from: {
          id: 12345
        }
      }
    };

    const user = await parseUpdate(update);

    expect(createPack).toHaveBeenCalledWith(mockUser, update.message);
  });

  it('should call addSticker function', async () => {
    addSticker.mockImplementation();
    const update = {
      message: {
        text: '/add_sticker',
        from: {
          id: 12345
        }
      }
    };

    const user = await parseUpdate(update);

    expect(addSticker).toHaveBeenCalledWith(mockUser, update.message);
  });

  it('should call createAnimatedSticker function', async () => {
    createAnimatedPack.mockImplementation();
    const update = {
      message: {
        text: '/create_animated_pack',
        from: {
          id: 12345
        }
      }
    };

    const user = await parseUpdate(update);

    expect(createAnimatedPack).toHaveBeenCalledWith(mockUser, update.message);
  });
});
