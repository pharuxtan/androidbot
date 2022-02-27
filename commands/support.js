module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    try{
      message.channel.send("https://discord.gg/qm9X3hM");
    } catch(e){
      message.channel.send(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["support"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Get bot support server",
    "example": "{prefix}support"
  }

  return command;
}
