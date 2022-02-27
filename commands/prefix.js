module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    try{
      if(message.channel.type !== "dm"){
  			if(message.member.hasPermission(["MANAGE_GUILD"], false, true, true)){
  				const prf = message.content.split(' ')[1]
  				if(prf !== undefined){
  						globalVariables.guild[message.guild.id]['prefix'] = prf
  						fs.writeFileSync(__dirname+"/../../guild.json",JSON.stringify(globalVariables.guild),"utf8");
  						message.channel.send("The prefix has been changed to `" + prf + "`");
  				} else {
  					message.channel.send("Please enter a prefix!")
  				}
  			} else {
  				message.channel.send("You don't have permission to make this command")
  			}
      }
    } catch(e){
      console.log(e);
      message.channel.send(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["prefix"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Edit the server bot prefix",
    "example": "{prefix}prefix [prefix]"
  }

  return command;
}
