module.exports = (globalVariables) => {
  if(!globalVariables.Discord) globalVariables.Discord = require("discord.js");
  if(!globalVariables.client) globalVariables.client = globalVariables.bot = new globalVariables.Discord.Client({disableEveryone: true});
  if(!globalVariables.fs) globalVariables.fs = require("fs");
  if(!globalVariables.getFiles) globalVariables.getFiles = (dir, files_) => {
    files_ = files_ || [];
    if(globalVariables.fs.existsSync(dir)) {
      var files = globalVariables.fs.readdirSync(dir);
      for(var i in files) {
        var name = dir + '/' + files[i];
        if(globalVariables.fs.statSync(name).isDirectory()) {
          globalVariables.getFiles(name, files_);
        } else {
          files_.push(name);
        }
      }
    }
    return files_;
  }
  if(!globalVariables.listeners) globalVariables.listeners = [];
  globalVariables.prefix = "!";
}
