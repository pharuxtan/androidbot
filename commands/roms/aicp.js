module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let msg = await message.channel.send(`Searching official AICP for \`${devicename(codename)}\`...`);
    try {
      let aicp = (await fetch(`https://ota.aicp-rom.com/ota_json.php?device=${codename}&type=weekly`).then(res => res.json())).response[0];
      if(aicp.url !== "placeholder"){
        let embed = new Discord.MessageEmbed()
          .setTitle(`AICP | ${devicename(codename).split(" | ")[0]}`)
          .setDescription(`**Version**: \`${aicp.version}\`\n**Date**: \`${timeconv(aicp.datetime)}\`\n**Size**: \`${pretty(aicp.size)}\`\n**Download**: [${aicp.filename}](${aicp.url})`);
        msg.edit("",{embed});
      } else {
        msg.edit(`AICP wasn't find for \`${devicename(codename)}\``);
      }
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["aicp"],
    enable: true
  };

  command.romname = "Android Ice Cold Project"

  command.help = {
    "category": "roms",
    "description": "Get Official "+command.romname+" for a specific device",
    "example": "{prefix}"+command.options.name[0]+" violet"
  }

  command.roms = async function(codename){
    try {
      let aicp = (await fetch(`https://ota.aicp-rom.com/ota_json.php?device=${codename}&type=weekly`).then(res => res.json())).response[0];
      if(aicp.url !== "placeholder"){
        return `${command.romname} (${command.options.name.join("/")})`
      } else {
        return null
      }
    } catch(e){
      return null
    }
  }

  return command;
}
