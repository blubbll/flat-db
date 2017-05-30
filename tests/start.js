var path = require('path');

/**
 * Import specs
 */

var dir = '../tests/specs/';
[
  'utils',
  'main',
  'collection',
  'finder'
].forEach((script) => {
  require(path.join(dir, script));
});
