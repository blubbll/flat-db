// config

var debug = require('debug');
var error = debug('flatdb:error');

var env = process.env || {}; // eslint-disable-line no-process-env

[
  'NODE_ENV',
  'FLATDB_DIR',
  'FLATDB_HOST',
  'FLATDB_PORT'
].forEach((name) => {
  if (!env[name]) {
    error(`Environment variable ${name} is missing, use default instead.`);
  }
});

var config = {
  ENV: env.NODE_ENV || 'development',
  dir: env.FLATDB_DIR || './flatdb/',
  ext: '.fdb'
};

let host = env.FLATDB_HOST || 'http://0.0.0.0';
let port = env.FLATDB_PORT || '8648';

config.host = host;
config.port = port;
config.url = `${host}:${port}`;

module.exports = config;
