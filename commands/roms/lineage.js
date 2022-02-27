module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let msg = await message.channel.send(`Searching official LineageOS for \`${devicename(codename)}\`...`);
    try {
      let los = (await fetch(`https://download.lineageos.org/api/v1/${codename}/nightly/*`).then(res => res.json())).response.slice(-1)[0];
      if(los == undefined){
        los = (await fetch(`https://download.lineageos.org/api/v1/${codename.toUpperCase()}/nightly/*`).then(res => res.json())).response.slice(-1)[0];
        if(los == undefined){
          return msg.edit(`LineageOS wasn't find for \`${devicename(codename)}\``);
        }
      }
      let embed = new Discord.MessageEmbed()
        .setTitle(`LineageOS | ${devicename(codename).split(" | ")[0]}`)
        .setDescription(`**Version**: \`${los.version}\`\n**Date**: \`${timeconv(los.datetime)}\`\n**Size**: \`${pretty(los.size)}\`\n**Download**: [${los.filename}](${los.url})`);
      msg.edit("",{embed});
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["los","lineage","lineageos"],
    enable: true
  };

  command.romname = "LineageOS"

  command.help = {
    "category": "roms",
    "description": "Get Official "+command.romname+" for a specific device",
    "example": "{prefix}"+command.options.name[0]+" violet"
  }

  command.roms = async function(codename){
    try {
      let los = (await fetch(`https://download.lineageos.org/api/v1/${codename}/nightly/*`).then(res => res.json())).response.slice(-1)[0];
      if(los == undefined){
        los = (await fetch(`https://download.lineageos.org/api/v1/${codename.toUpperCase()}/nightly/*`).then(res => res.json())).response.slice(-1)[0];
        if(los == undefined){
          return null;
        }
      }
      return `${command.romname} (${command.options.name.join("/")})`
    } catch(e){
      return null;
    }
  }

  return command;
}
