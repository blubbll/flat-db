// routers

var Router = require('koa-router');
var r = new Router();

var {
  get,
  list,
  add,
  update,
  remove
} = require('../services');

r.get('/:collection/:key', get);
r.get('/:collection', list);
r.post('/:collection', add);
r.put('/:collection/:key', update);
r.del('/:collection/:key', remove);

module.exports = r;
