// services / get

var debug = require('debug');
var info = debug('flatdb:api:info');
var error = debug('flatdb:api:error');

var {Collection} = require('../main');

var get = (ctx) => {
  let {collection = '', key = ''} = ctx.params;

  let data = {
    collection,
    key,
    entry: null
  };

  info(`Get item "${key}" from collection "${collection}"`);
  try {
    let c = new Collection(collection);
    data.entry = c.get(key);
    info(data);
  } catch (err) {
    error(err);
  }

  return ctx.json(200, data);
};

module.exports = get;
