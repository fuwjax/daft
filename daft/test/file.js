const fs = require('fs');

var dropFile = function(path) {
  if(fs.existsSync(path)){
    if(fs.lstatSync(path).isDirectory()){
      fs.readdirSync(path).forEach(function(file){
        dropFile(path + "/" + file);
      });
      fs.rmdirSync(path);
    } else {
      fs.unlinkSync(path);
    }
  }
};
exports.dropFile = dropFile;
