// services / add

var debug = require('debug');
var info = debug('flatdb:api:info');
var error = debug('flatdb:api:error');

var {
  hasProperty,
  isObject
} = require('bellajs');

var {Collection} = require('../main');

var add = (ctx) => {

  let {collection = ''} = ctx.params;
  let {body} = ctx.request;

  let data = {
    collection
  };

  try {

    if (isObject(body) && hasProperty(body, 'action')) {
      let {
        action,
        schema = {},
        query = {}
      } = body;

      data.action = action;

      if (action === 'create') {
        info(`Create collection "${collection}"`);
        let c = new Collection(collection, schema);
        data.collection = c.name;
        data.schema = c.schema;
      } else if (action === 'reset') {
        info(`Reset collection "${collection}"`);
        let c = new Collection(collection);
        c.reset();
        data.collection = c.name;
      } else if (action === 'find') {
        let c = new Collection(collection);
        let {
          query: xquery,
          entries
        } = c.query(query);

        data.query = xquery;
        data.entries = entries;
      }
    } else {
      info(`Add data to collection "${collection}"`);
      let c = new Collection(collection);
      data.collection = c.name;
      data.entries = c.add(body);
    }
    info(data);
  } catch (err) {
    error(err);
  }

  return ctx.json(200, data);
};

module.exports = add;
