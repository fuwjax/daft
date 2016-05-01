const exec = require('child_process').execSync;
const assert = require('chai').assert;
const sinon = require('sinon');
const process = require('process');
const console = require('console');
const dropFile = require('../src/file').dropFile;

describe('daft', function() {
  before(function(){
    exec("cp -r test/testrepo test/repo");
    exec("git init", [], "test/repo");
  });
  beforeEach(function(){
    // The beforeEach() callback gets run before each test in the suite.
  });
  it('does x when y', function(){
    assert.equal(-1, [1,2,3].indexOf(5));
  });
  after(function() {
    dropFile("test/repo");
  });
});
