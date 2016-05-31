const fs = require('fs');
const yaml = require('js-yaml');
const exec = require('child_process').execSync;
const http = require('http');
const console = require('console');
const sns = new AWS.SNS();
const toUrl = require('url').parse;

const PORT 80;

var handleRequest = function(request, response) {
  var url = toUrl(request.url, true);
  console.log(request.method);
  console.log(url);
  console.log(request.rawHeaders);
  request.on('data', (chunk) => {
    console.log(chunk);
  });
  request.on('end', () => {
    response.writeHead(200, {
      'Content-Type': 'text/plain; charset=UTF-8'
    });
    response.end("Request received @ "+request.url);
  });
}

var main = function(){
  var server = http.createServer(handleRequest);
  server.listen(PORT, () => {
    console.log("Server connected on "+server.address);
  });
}

module.exports = exports = main;
