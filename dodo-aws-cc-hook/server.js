#! /usr/bin/env node
const main = require('./src/main');
const console = require('console');
const http = require('http');
const process = require('process');

var serve = function(port){
  var server = http.createServer((req, resp) => {
    try{
      var result = main.handler(req, resp);
      if(result){
        server.close(() => {
          console.log("exiting server");
          process.exit(result);
        });
      }
    }catch(ex){
      console.error(ex.message);
      resp.writeHead(500);
      resp.end(ex.message);
    }
  });
  server.listen(port, () => {
    console.log("Server connected on "+JSON.stringify(server.address()));
  });
}

if (require.main === module) {
  serve.apply(this, process.argv.slice(2));
}else{
  module.exports = exports = serve;
}
