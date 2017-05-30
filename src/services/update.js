// services / update

var debug = require('debug');
var info = debug('flatdb:api:info');
var error = debug('flatdb:api:error');

var {Collection} = require('../main');

var update = (ctx) => {

  let {collection = '', key = ''} = ctx.params;
  let {body} = ctx.request;

  let data = {
    collection,
    key,
    updated: false
  };

  info(`Update item from collection "${collection}" by "${key}"`);
  try {
    let c = new Collection(collection);
    data.updated = c.update(key, body);
    info(data);
  } catch (err) {
    error(err);
  }

  return ctx.json(200, data);
};

module.exports = update;
