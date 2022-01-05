const { Datastore } = require('@google-cloud/datastore');
const ds = new Datastore();

async function upsertUser(user) {
  const { id, menuState, packName, packTitle, emojis } = user;

  const userKey = ds.key(['User', id]);
  const userData = {
    menuState,
    packName,
    packTitle,
    emojis
  };

  const entity = {
    key: userKey,
    data: userData
  };

  await ds.upsert(entity);

  return Promise.resolve(true);
}

async function getUser(userId) {
  const query = ds.createQuery('User')
    .filter('__key__', '=', ds.key(['User', userId]));

  const [user] = await ds.runQuery(query);

  if (user.length === 0) {
    return Promise.resolve(null);
  }

  return Promise.resolve(user[0]);
}

module.exports = {
  upsertUser,
  getUser
};
