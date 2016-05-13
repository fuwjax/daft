const fs = require('fs');
const yaml = require('js-yaml');
const exec = require('child_process').execSync;
const console = require('console');

var makeOpts = function(paths){
  return paths.map(function(container, local){
    return "-v "+container+":"+local;
  }).join(" ");
};

var daft = function(){
  var src = fs.readFileSync('build.daft', 'utf8');
  var pair = src.split("---", 3);
  var opts = pair.length < 2 ? {} : yaml.safeLoad(pair[1]);
  var alias = {};
  pair[0].split("\\n").forEach(function(line, lineNo){
    if(!line || line.startsWith("#")){
      // do nothing
    }else if(line.startsWith(">")){
      exec(line.substring(1).trim());
    }else{
      var parts = line.split("\\s+", 2);
      if(parts.length == 1 && parts[0].endsWith(":")){
        console.log(parts[0]);
      }else if(parts[0] == "alias"){
        alias[parts[1]] = parts[2];
      }else{
        var image = parts[0] in alias ? alias[parts[0]] : parts[0];
        var dopts = makeOpts(parts.length > 1 ? opts[parts[1]] : {});
        var args = parts.length > 2 ? parts[2] : '';
        exec("docker run "+dopts+" "+image+" "+args);
      }
    }
  });
};

module.exports = exports = daft;
