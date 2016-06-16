const fs = require('fs');
const yaml = require('js-yaml');
const exec = require('child_process').exec;
const http = require('http');
const console = require('console');
const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const toUrl = require('url').parse;
const process = require('process');
const format = require('util').format;

module.exports.handler = function(request, response) {
  var url = toUrl(request.url, true);
  console.log(request.method);
  console.log(url);
  console.log(request.rawHeaders);
  var body = [];
  request.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    var event = JSON.parse(Buffer.concat(body).toString());
    var ref = event.Records[0].codecommit.references[0].ref;
    var region = event.Records[0].awsRegion;
    var command = event.Records[0].customData;
    var repoArn = event.Records[0].eventSourceARN;
    var repoName = repoArn.substring(repoArn.lastIndexOf(':') + 1);
    var branch = ref.substring(ref.lastIndexOf('/') + 1);
    exec(format('git clone --branch %s https://git-codecommit.%s.amazonaws.com/v1/repos/%s repo', branch, region, repo),(err, cloneout, cloneerr) =>{
      if(err) return response.writeHead(500);
      exec(command, {'cwd', 'repo'}, (err, stdout, stderr) => {
        if(err) return response.writeHead(500);
        response.writeHead(200, {
          'Content-Type': 'text/plain; charset=UTF-8'
        });
        response.end(format('Clone: %s\nClone Error: %s\nCommand: %s\nCommand Error:%s', cloneout, cloneerr, stdout, stderr));        
      });
    })
  });
}
