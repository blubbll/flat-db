// routers

var Router = require('koa-router');
var r = new Router();

var service = require('../services');

r.get('/:collection/:key', service.get);
r.get('/:collection', service.list);
r.post('/:collection', service.add);
r.put('/:collection/:key', service.update);
r.del('/:collection/:key', service.remove);

module.exports = r;
