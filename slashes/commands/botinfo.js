module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(slash){
    if(this.bot_info) slash.callMessageEvent();
    else {
      try{
        let link = await client.generateInvite(["ATTACH_FILES", "ADD_REACTIONS", "SEND_MESSAGES"]);
        link = link.replace("scope=bot", "scope=applications.commands%20bot%20applications.commands.update");
        var embed = new Discord.MessageEmbed()
          .setTitle(`${client.user.tag} (${client.user.id})`).setURL(link)
          .setThumbnail(client.user.avatarURL())
          .addField(`Servers`, client.guilds.cache.size, true)
          .addField(`Codename Numbers`, Object.keys(device).length, true).addField(`Samsung Model Numbers`, Object.keys(sm).length, true)
          .setFooter(`By ${client.users.cache.get("254326758864715777").tag}`)
        slash.send(embed);
      } catch(e){
        slash.send(`An error occured, please retry later.`);
      }
    }
  }

  command.options = {
    name: ["botinfo"],
    enable: true
  };

  return command;
}
