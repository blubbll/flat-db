// services / list

var debug = require('debug');
var info = debug('flatdb:api:info');
var error = debug('flatdb:api:error');

var {Collection} = require('../main');

var list = (ctx) => {
  let {collection = ''} = ctx.params;
  let data = {
    collection,
    entries: []
  };

  info(`Get all entries from collection "${collection}"`);
  try {
    let c = new Collection(collection);
    data.entries = c.all();
    info(data);
  } catch (err) {
    error(err);
  }

  return ctx.json(200, data);
};

module.exports = list;
