/**
 * FlatDB - utils -> chainify
 * @ndaidong
 **/

var debug = require('debug');
var error = debug('flatdb:error');

var {hasProperty} = require('bellajs');

var commands = [
  '$eq', '$ne',
  '$gt', '$lt',
  '$gte', '$lte',
  '$match'
];

var getCommand = (query, schema) => {
  try {
    let cmd = Object.keys(query)[0];
    let val = query[cmd];
    if (commands.includes(cmd) && typeof val === typeof schema) {
      if (cmd === '$match') {
        let match = val.match(new RegExp('^/(.*?)/([gimy]*)$'));
        val = new RegExp(match[1], match[2]);
      }
      return {
        c: cmd.slice(1),
        v: val
      };
    }
  } catch (err) {
    error(err);
  }
  return false;
};

let chainify = (query = {}, schema = {}) => {
  let selected = [];
  for (let k in query) {
    if (hasProperty(schema, k)) {
      let command = getCommand(query[k], schema[k]);
      if (command) {
        let {
          c,
          v
        } = command;
        selected.push({
          key: k,
          command: c,
          value: v
        });
      }
    }
  }
  return selected;
};

module.exports = chainify;
