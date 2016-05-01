const fs = require('fs');

var dropFile = function(path) {
  if(fs.lstatSync(path).isDirectory()){
    fs.readdirSync(path).forEach(function(file){
      dropFile(path + "/" + file);
    });
    fs.rmdirSync(path);
  }else if(fs.existsSync(path)){
    fs.unlinkSync(path);
  }
};
module.exports.dropFile = dropFile;
