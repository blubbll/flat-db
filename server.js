// server

var path = require('path');

var debug = require('debug');
var info = debug('flatdb:api:info');
var error = debug('flatdb:api:error');

var Koa = require('koa');
var favicon = require('koa-favicon');
var bodyParser = require('koa-bodyparser');
var responseTime = require('koa-response-time');
var cors = require('kcors');
var config = require('./src/configs');

var {
  host,
  port,
  url
} = config;

var app = new Koa();

app.context.config = config;

app.use(cors());
app.use(responseTime());
app.use(bodyParser({
  encode: 'utf-8',
  formLimit: '4kb',
  jsonLimit: '128kb',
  onerror: (err, ctx) => {
    ctx.throw('body parse error', 422);
    error(err);
  }
}));

app.use(favicon(path.join(__dirname, '/favicon.ico')));

app.context.json = function json(status = 200, data = {}) {
  let ctx = this; // eslint-disable-line
  ctx.status = status;
  ctx.response.type = 'application/json';
  ctx.body = JSON.stringify(data);
};

var router = require('./src/configs/routers');
app.use(router.routes());
app.use(router.allowedMethods({throw: true}));

app.use((ctx) => {
  ctx.json(404, {
    status: 'Error',
    message: 'Resource not found'
  });
});

app.use((err, ctx) => {
  error(err);
  ctx.json(500, {
    status: 'Error',
    message: 'Something went wrong'
  });
});

var onServerReady = () => {
  info('Access APIs via', `${host}:${port}`);
  info(`Public URL: ${url || 'None'}`);
};

app.listen(port, onServerReady);

module.exports = app;
