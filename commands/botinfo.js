module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    try{
      let link = await client.generateInvite(["ATTACH_FILES", "ADD_REACTIONS", "SEND_MESSAGES"]);
      link = link.replace("scope=bot", "scope=applications.commands%20bot");
      var embed = new Discord.MessageEmbed()
        .setTitle(`${client.user.tag} (${client.user.id})`).setURL(link)
        .setThumbnail(client.user.avatarURL())
        .addField(`Servers`, client.guilds.cache.size, true)
        .addField(`Codename Numbers`, Object.keys(device).length, true).addField(`Samsung Model Numbers`, Object.keys(sm).length, true)
        .setFooter(`By ${client.users.cache.get("254326758864715777").tag}`)
      message.channel.send(embed);
    } catch(e){
      message.channel.send(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["botinfo"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Get information about the bot",
    "example": "{prefix}botinfo"
  }

  return command;
}
