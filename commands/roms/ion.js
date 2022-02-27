module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let msg = await message.channel.send(`Searching official ionOS for \`${devicename(codename)}\`...`);
    try {
      let ion = fetch(`https://raw.githubusercontent.com/ion-OS/OTA/ten/${codename}.json`);
      if((await ion).status !== 200){
        ion = fetch(`https://raw.githubusercontent.com/ion-OS/OTA/ten/${codename.toUpperCase()}.json`);
        if((await ion).status !== 200){
          return msg.edit(`ionOS wasn't find for \`${devicename(codename)}\``);
        } else {
          ion = (await ion.then(res => res.json()));
        }
      } else {
        ion = (await ion.then(res => res.json()));
      }
      let embed = new Discord.MessageEmbed()
        .setTitle(`ionOS | ${devicename(codename).split(" | ")[0]}`)
        .setDescription(`**Version**: \`${ion.version}\`\n**Date**: \`${timeconv(ion.datetime)}\`\n**Size**: \`${pretty(ion.size)}\`\n**Download**: [${ion.filename}](${ion.url.replace("/download", `?r=&ts=${Math.floor(Date.now() / 1000)}&use_mirror=autoselect`).replace("https://sourceforge.net/projects/i-o-n/files/","https://downloads.sourceforge.net/project/i-o-n/")})`);
      msg.edit("",{embed});
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["ion"],
    enable: true
  };

  command.romname = "ionOS"

  command.help = {
    "category": "roms",
    "description": "Get Official "+command.romname+" for a specific device",
    "example": "{prefix}"+command.options.name[0]+" violet"
  }

  command.roms = async function(codename){
    try {
      let ion = fetch(`https://raw.githubusercontent.com/ion-OS/OTA/ten/${codename}.json`);
      if((await ion).status !== 200){
        ion = fetch(`https://raw.githubusercontent.com/ion-OS/OTA/ten/${codename.toUpperCase()}.json`);
        if((await ion).status !== 200){
          return null;
        } else {
          ion = (await ion.then(res => res.json()));
        }
      } else {
        ion = (await ion.then(res => res.json()));
      }
      return `${command.romname} (${command.options.name.join("/")})`;
    } catch(e){
      return null;
    }
  }

  return command;
}
