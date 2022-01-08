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

  try {
    await ds.upsert(entity);
  } catch (error) {
    console.error(error);
  }

  return Promise.resolve(true);
}

async function getUser(userId) {
  const query = ds.createQuery('User')
    .filter('__key__', '=', ds.key(['User', userId]));

  let user;

  try {
    [user] = await ds.runQuery(query);
  } catch (error) {
    console.error(error);
  }

  if (user.length === 0) {
    return Promise.resolve(null);
  }

  return Promise.resolve(user[0]);
}

module.exports = {
  upsertUser,
  getUser
};
