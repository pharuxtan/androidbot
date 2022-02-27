module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    try{
      let link = await client.generateInvite(["ATTACH_FILES", "ADD_REACTIONS", "SEND_MESSAGES"]);
      link = link.replace("scope=bot", "scope=applications.commands%20bot");
      message.channel.send(`<${link}>`);
    } catch(e){
      message.channel.send(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["invite"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Get bot invite",
    "example": "{prefix}invite"
  }

  return command;
}
