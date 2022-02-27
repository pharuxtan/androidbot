module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });
  
  function event(message){
    if(message.slash) message.content = prefix + message.content;
    let commands = getFiles(__dirname+"/../commands").filter(f => f.endsWith(".js"));
    for(let i=0; i<commands.length; i++){
      let command = require(commands[i])(globalVariables);
      for(let n=0; n<command.options.name.length; n++){
        if(message.content.toLowerCase().startsWith(prefix+command.options.name[n].toLowerCase()) && command.options.enable) return command(message);
      }
    }
  }
  
  event.listener = "message";
  
  return event;
}