#!/bin/bash

function startdocker {
  docker-machine start
  eval $(docker-machine env)
}

[ -d node_modules ] || npm install
BIN=./node_modules/.bin

docker-machine status default || startdocker
$BIN/jshint src test index.js
NODE_ENV=test $BIN/mocha --recursive --reporter spec --timeout 3000
#@NODE_ENV=test $BIN/mocha -R tap > results.tap
#@NODE_ENV=test $BIN/mocha --recursive -R xunit > results.xml --timeout 3000
