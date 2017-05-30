// services / remove

var debug = require('debug');
var info = debug('flatdb:api:info');
var error = debug('flatdb:api:error');

var {Collection} = require('../main');

var remove = (ctx) => {
  let {collection = '', key = ''} = ctx.params;

  let data = {
    collection,
    key,
    entry: null
  };

  info(`Remove item from collection "${collection}" by "${key}"`);
  try {
    let c = new Collection(collection);
    data.removed = c.remove(key);
    info(data);
  } catch (err) {
    error(err);
  }

  return ctx.json(200, data);
};

module.exports = remove;
