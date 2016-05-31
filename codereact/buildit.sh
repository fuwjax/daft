#!/bin/bash
set -e

SQS=https://sqs.us-east-1.amazonaws.com/590934953599/d3p0-build
GIT=https://git-codecommit.us-east-1.amazonaws.com/v1/repos/hubot
ECR=590934953599.dkr.ecr.us-east-1.amazonaws.com/d3p0
TAG=latest

git config --global credential.helper '!aws codecommit credential-helper $@'
git config --global credential.UseHttpPath true

msg=$(aws sqs receive-message --queue-url $SQS --max-number-of-messages 1)
[ -z "$msg" ] && exit 0

git clone $GIT repo
$(aws ecr get-login)
docker build -t $ECR:$TAG repo
docker push $ECR:$TAG

handle=$(echo "$msg" | perl -n -e '/^.*"ReceiptHandle":\s+"([^"]+)"/ && print "$1"')
aws sqs delete-message --queue-url $SQS --receipt-handle $handle
