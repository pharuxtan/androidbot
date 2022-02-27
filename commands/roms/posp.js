module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let msg = await message.channel.send(`Searching official POSP for \`${devicename(codename)}\`...`);
    try {
      let posp = (await fetch(`https://api.potatoproject.co/api/ota/builds/?device=${codename}&build_type=official`).then(res => res.json())).results;
      if(posp.length == 0){
        posp = (await fetch(`https://api.potatoproject.co/api/ota/builds/?device=${codename.toUpperCase()}&build_type=official`).then(res => res.json())).results;
        if(posp.length == 0) return msg.edit(`POSP wasn't find for \`${devicename(codename)}\``);
      }
      posp = posp[0];
      let embed = new Discord.MessageEmbed()
        .setTitle(`POSP | ${devicename(codename).split(" | ")[0]}`)
        .setDescription(`**Version**: \`${posp.version}\`\n**Date**: \`${timeconv(posp.build_date)}\`\n**Size**: \`${pretty(posp.size)}\`\n**MD5**: \`${posp.md5}\`\n**Download**: [${posp.filename}](${posp.url.replace("https://sourceforge.net/projects/posp/files/", "https://downloads.sourceforge.net/project/posp/")}?r=&ts=${Math.floor(Date.now() / 1000)}&use_mirror=autoselect)`);
      msg.edit("",{embed});
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["posp","potato"],
    enable: true
  };

  command.romname = "Potato Open Sauce Project"

  command.help = {
    "category": "roms",
    "description": "Get Official "+command.romname+" for a specific device",
    "example": "{prefix}"+command.options.name[0]+" violet"
  }

  command.roms = async function(codename){
    try {
      let posp = (await fetch(`https://api.potatoproject.co/api/ota/builds/?device=${codename}&build_type=official`).then(res => res.json())).results;
      if(posp.length == 0){
        posp = (await fetch(`https://api.potatoproject.co/api/ota/builds/?device=${codename.toUpperCase()}&build_type=official`).then(res => res.json())).results;
        if(posp.length == 0) return null;
      }
      return `${command.romname} (${command.options.name.join("/")})`;
    } catch(e){
      return null
    }
  }

  return command;
}
