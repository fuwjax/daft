#! /usr/bin/env node
const main = require('./src/main');

if (require.main === module) {
  main.apply(this, process.argv.slice(2));
}else{
  module.exports = exports = main;
}
