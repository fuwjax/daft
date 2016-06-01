#!/bin/bash
set -e

git config --global credential.helper '!aws codecommit credential-helper $@'
git config --global credential.UseHttpPath true

git clone --branch "${BRANCH:-master}" https://git-codecommit.${REGION:-us-east-1}.amazonaws.com/v1/repos/$REPO repo
cd repo
${CMD:-echo success}
