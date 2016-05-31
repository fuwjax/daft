#!/bin/bash
set -e

git config --global credential.helper '!aws codecommit credential-helper $@'
git config --global credential.UseHttpPath true

git clone --branch $BRANCH https://git-codecommit.$REGION.amazonaws.com/v1/repos/$REPO repo
cd repo
$CMD
