module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let msg = await message.channel.send(`Searching official Evolution X for \`${devicename(codename)}\`...`);
    try {
      let evox = fetch(`https://raw.githubusercontent.com/evolution-x-devices/official_devices/master/builds/${codename}.json`);
      if((await evox).status !== 200){
        evox = fetch(`https://raw.githubusercontent.com/evolution-x-devices/official_devices/master/builds/${codename.toUpperCase()}.json`);
        if((await evox).status !== 200){
          return msg.edit(`Evolution X wasn't find for \`${devicename(codename)}\``);
        } else {
          evox = (await evox.then(res => res.json()));
        }
      } else {
        evox = (await evox.then(res => res.json()));
      }
      let embed = new Discord.MessageEmbed()
        .setTitle(`Evolution X | ${devicename(codename).split(" | ")[0]}`)
        .setDescription(`**Version**: \`${evox.version}\`\n**Date**: \`${timeconv(evox.datetime)}\`\n**Size**: \`${pretty(evox.size)}\`\n**MD5**: \`${evox.filehash}\`\n**Download**: [${evox.filename}](https://downloads.sourceforge.net/project/evolution-x/${evox.filename.split("-")[0].split("_")[2]}/${evox.filename}?r=&ts=${Math.floor(Date.now() / 1000)}&use_mirror=autoselect)`);
      msg.edit("",{embed});
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["evox","evo","evolutionx"],
    enable: true
  };

  command.romname = "Evolution X"

  command.help = {
    "category": "roms",
    "description": "Get Official "+command.romname+" for a specific device",
    "example": "{prefix}"+command.options.name[0]+" violet"
  }

  command.roms = async function(codename){
    try {
      let evox = fetch(`https://raw.githubusercontent.com/evolution-x-devices/official_devices/master/builds/${codename}.json`);
      if((await evox).status !== 200){
        evox = fetch(`https://raw.githubusercontent.com/evolution-x-devices/official_devices/master/builds/${codename.toUpperCase()}.json`);
        if((await evox).status !== 200){
          return null;
        } else {
          evox = (await evox.then(res => res.json()));
        }
      } else {
        evox = (await evox.then(res => res.json()));
      }
      return `${command.romname} (${command.options.name.join("/")})`;
    } catch(e){
      return null;
    }
  }

  return command;
}
