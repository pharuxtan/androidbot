module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let msg = await message.channel.send(`Searching official Paranoid Android for \`${devicename(codename)}\`...`);
    try {
      let devices = (await fetch(`http://api.aospa.co/devices`).then(res => res.json())).devices;

      let device = devices.find(device => device.name === codename);

      if(!device) return msg.edit(`Paranoid Android wasn't find for \`${devicename(codename)}\``);

      let aospa = await fetch(`http://api.aospa.co/updates/${codename}`).then(res => res.json());

      if(aospa.message) return msg.edit(`Paranoid Android wasn't find for \`${devicename(codename)}\``);

      aospa = aospa.updates.slice(-1)[0];

      let embed = new Discord.MessageEmbed()
        .setTitle(`Paranoid Android | ${devicename(codename).split(" | ")[0]}`)
        .setDescription(`**Version**: \`${aospa.version}\`\n**Date**: \`${aospa.build.substring(0,4)}-${aospa.build.substring(4,6)}-${aospa.build.substring(6,8)}\`\n**Size**: \`${pretty(aospa.size)}\`\n**MD5**: \`${aospa.md5}\`\n**Download**: [${aospa.name}](${aospa.url})`);
      msg.edit("",{embed});
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["aospa", "paranoid"],
    enable: true
  };

  command.romname = "Paranoid Android"

  command.help = {
    "category": "roms",
    "description": "Get Official "+command.romname+" for a specific device",
    "example": "{prefix}"+command.options.name[0]+" violet"
  }

  command.roms = async function(codename){
    try {
      let devices = (await fetch(`http://api.aospa.co/devices`).then(res => res.json())).devices;

      let device = devices.find(device => device.name === codename);

      if(!device) return null

      let aospa = await fetch(`http://api.aospa.co/updates/${codename}`).then(res => res.json());

      if(aospa.message) return null

      return `${command.romname} (${command.options.name.join("/")})`;
    } catch(e){
      return null
    }
  }

  return command;
}
