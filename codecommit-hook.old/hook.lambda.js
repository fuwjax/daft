var AWS = require('aws-sdk');

var ecs = new AWS.ECS();
var cluster = 'default';

module.exports.handler = function(event, context) {
  var ref = event.Records[0].codecommit.references[0].ref;
  var region = event.Records[0].awsRegion;
  var command = event.Records[0].customData;
  var repoArn = event.Records[0].eventSourceARN;
  var repoName = repoArn.substring(repoArn.lastIndexOf(':') + 1);
  var branch = ref.substring(ref.lastIndexOf('/') + 1);

  var params = {
    taskDefinition: 'hook',
    startedBy: repoName,
    cluster: cluster,
    count: 1,
    overrides: {
      containerOverrides: [
        {
          name: 'hook',
          environment: [
            { name: "REGION", value: region },
            { name: "REPO", value: repoName },
            { name: "BRANCH", value: branch },
            { name: "CMD", value: command },
          ]
        }
      ]
    }
  };
  ecs.runTask(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
};
