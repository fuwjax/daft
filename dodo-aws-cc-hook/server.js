#! /usr/bin/env node
const main = require('./src/main');
const console = require('console');
const http = require('http');
const process = require('process');
const toUrl = require('url').parse;

var serve = function(port){
  var server = http.createServer((request, response) => {
    var body = [];
    request.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      try{
        main.handler({
          method: request.method,
          target: toUrl(request.url, true),
          headers: request.headers,
          body: Buffer.concat(body)
        }, (err, resp) => {
          if(err) {
            console.error(err.message);
            response.writeHead(500);
            response.end(err.message);
          } else {
            response.writeHead(resp.code, resp.headers);
            response.end(resp.body);
          }
        });
      } catch(ex) {
        response.writeHead(500);
        response.end(ex.message);
        console.error(ex.message);
        console.error(request.method+" "+request.url);
        console.error(request.headers);
        console.error(Buffer.concat(body).toString());
      }
    });
  });
  if(!port || port <= 0 || port >= 65535){
    port = 80;
  }
  server.listen(port, () => {
    console.log("Server connected on "+JSON.stringify(server.address()));
  });
}

if (require.main === module) {
  serve.apply(this, process.argv.slice(2));
}else{
  module.exports = exports = serve;
}
