module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let msg = await message.channel.send(`Searching official SuperiorOS for \`${devicename(codename)}\`...`);
    try {
      let superior = fetch(`https://raw.githubusercontent.com/SuperiorOS/official_devices/ten/builds/${codename}.json`);
      if((await superior).status !== 200){
        superior = fetch(`https://raw.githubusercontent.com/SuperiorOS/official_devices/ten/builds/${codename.toUpperCase()}.json`);
        if((await superior).status !== 200){
          return msg.edit(`SuperiorOS wasn't find for \`${devicename(codename)}\``);
        } else {
          superior = (await superior.then(res => res.json())).response[0];
        }
      } else {
        superior = (await superior.then(res => res.json())).response[0];
      }
      let embed = new Discord.MessageEmbed()
        .setTitle(`SuperiorOS | ${devicename(codename).split(" | ")[0]}`)
        .setDescription(`**Version**: \`${superior.version}\`\n**Date**: \`${timeconv(superior.datetime)}\`\n**Size**: \`${pretty(superior.size)}\`\n**Download**: [${superior.filename}](${superior.url})`);
      msg.edit("",{embed});
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["superior"],
    enable: true
  };

  command.romname = "SuperiorOS"

  command.help = {
    "category": "roms",
    "description": "Get Official "+command.romname+" for a specific device",
    "example": "{prefix}"+command.options.name[0]+" violet"
  }

  command.roms = async function(codename){
    try {
      let superior = fetch(`https://raw.githubusercontent.com/SuperiorOS/official_devices/ten/builds/${codename}.json`);
      if((await superior).status !== 200){
        superior = fetch(`https://raw.githubusercontent.com/SuperiorOS/official_devices/ten/builds/${codename.toUpperCase()}.json`);
        if((await superior).status !== 200){
          return null;
        } else {
          superior = (await superior.then(res => res.json())).response[0];
        }
      } else {
        superior = (await superior.then(res => res.json())).response[0];
      }
      return `${command.romname} (${command.options.name.join("/")})`;
    } catch(e){
      return null;
    }
  }

  return command;
}
