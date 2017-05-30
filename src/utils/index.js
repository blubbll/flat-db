// index

var exec = require('child_process').execSync;
var mkdir = require('mkdirp').sync;

var rmdir = (d) => {
  return exec(`rm -rf ${d}`);
};

var fixPath = require('./fixPath');
var readFile = require('./readFile');
var writeFile = require('./writeFile');
var delFile = require('./delFile');
var exists = require('./exists');

var normalize = require('./normalize');
var chainify = require('./chainify');

module.exports = {
  fixPath,
  readFile,
  writeFile,
  delFile,
  exists,
  mkdir,
  rmdir,
  normalize,
  chainify
};
