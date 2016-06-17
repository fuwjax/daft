const proc = require('child_process');
const format = require('util').format;
const https = require('https');

proc.execSync("git config --global credential.helper '!aws codecommit credential-helper $@'");
proc.execSync("git config --global credential.UseHttpPath true");

var processCommit = function(event, cb) {
  var msg = JSON.parse(event.Message);
  var ref = msg.Records[0].codecommit.references[0].ref;
  var region = msg.Records[0].awsRegion;
  var command = msg.Records[0].customData;
  var repoArn = msg.Records[0].eventSourceARN;
  var repo = repoArn.substring(repoArn.lastIndexOf(':') + 1);
  var branch = ref.substring(ref.lastIndexOf('/') + 1);
  proc.exec(format('git clone --branch %s https://git-codecommit.%s.amazonaws.com/v1/repos/%s repo', branch, region, repo),(err, cloneout, cloneerr) =>{
    if(err) return cb(err);
    proc.exec(command, {'cwd': 'repo'}, (err, stdout, stderr) => {
      if(err) return cb(err);
      cb(null, {
        code: 200,
        headers: {'Content-Type': 'text/plain; charset=UTF-8'},
        body: format('Clone: \n%s\n\nClone Error: \n%s\n\nCommand: \n%s\n\nCommand Error:\n%s', cloneout, cloneerr, stdout, stderr)
      });
    });
  });
}

var processConfirmation = function(event, cb){
  https.get(event.SubscribeURL, (resp) => {
    resp.on('data', (data) => {
      cb(null, {
        code: resp.statusCode,
        headers: resp.headers,
        body: data
      })
    });
  }).on('error', (err) => {
    cb(err);
  });
}

module.exports.handler = function(req, cb) {
  var type = req.headers['x-amz-sns-message-type'];
  if(!type){
    cb(null, {code: 200});
  }
  var event = JSON.parse(req.body.toString());
  if(type == 'SubscriptionConfirmation'){
    processConfirmation(event, cb);
  }else if(type == 'Notification'){
    processCommit(event, cb);
  }else{
    cb(new Error('Unexpected SNS request: '+type));
  }
}
