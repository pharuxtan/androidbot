module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(slash){
    if(slash.bot_scope) slash.callMessageEvent();
    else {
      try {
        var cdn = slash.content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(' ')[1]
        if(device[cdn.toLowerCase()] !== undefined){
          return slash.send("This codename corresponds to `"+device[cdn.toLowerCase()].join("` - `")+"`");
        } else {
          return slash.send("No phones found for `"+cdn+"`");
        }
      } catch(e){
        slash.send(`An error occured, please retry later.`);
      }
    }
  }

  command.options = {
    name: ["getphone"],
    enable: true
  };

  return command;
}
