const execSync = require('child_process').execSync;
const assert = require('chai').assert;
const sinon = require('sinon');
const process = require('process');
const console = require('console');
const dropFile = require('./file').dropFile;
const dodo = require('..');
const diff = require('diff');
const fs = require('fs');
const util = require('util');

var exec = function(command, opts, cwd){
  assert(execSync(command, opts, cwd), "Could not execute: "+command);
};

describe('dodo', function() {
  before(function(){
    dropFile("target");
    exec("mkdir -p target/repo");
    exec("git init", [], "target/repo");
    exec("cp -r testRepo/README target/repo");
    exec("cp -r testRepo/build.dodo target/repo");
  });
  beforeEach(function(){
    // The beforeEach() callback gets run before each test in the suite.
  });
  it('duplicates file', function(){
    process.chdir('target/repo');
    dodo();
    var change = diff.diffChars(fs.readFileSync("README", "utf8"), fs.readFileSync("README.bak", "utf8")).filter(function(e){ return e.added || e.removed;});
    assert.deepEqual(change, []);
  });
  after(function() {
    // do nothing
  });
});
