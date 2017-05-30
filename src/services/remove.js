// services / remove

var debug = require('debug');
var error = debug('flatdb:api:error');

var {Collection} = require('../main');

var remove = (ctx) => {
  let {collection = '', key = ''} = ctx.params;
  let data = {
    collection,
    key
  };
  try {
    let c = new Collection(collection);
    if (key) {
      data.entry = c.get(key);
    } else {
      data.entries = c.all();
    }
  } catch (err) {
    error(err);
  }

  return ctx.json(200, {
    code: 200,
    data
  });
};

module.exports = remove;