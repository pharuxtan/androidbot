module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let msg = await message.channel.send(`Searching official Pixel Experience for \`${devicename(codename)}\`...`);
    try {
      let pepie = await fetch(`https://download.pixelexperience.org/ota_v4/${codename}/pie`).then(res => res.json());
      let pepiep = await fetch(`https://download.pixelexperience.org/ota_v4/${codename}/pie_plus`).then(res => res.json());
      let peten = await fetch(`https://download.pixelexperience.org/ota_v4/${codename}/ten`).then(res => res.json());
      let petenp = await fetch(`https://download.pixelexperience.org/ota_v4/${codename}/ten_plus`).then(res => res.json());
      let peeleven = await fetch(`https://download.pixelexperience.org/ota_v4/${codename}/eleven`).then(res => res.json());
      let peelevenp = await fetch(`https://download.pixelexperience.org/ota_v4/${codename}/eleven_plus`).then(res => res.json());
      if(pepie.error === true && pepiep.error === true && peten.error === true && petenp.error === true && peeleven.error === true && peelevenp.error === true) return msg.edit(`Pixel Experience wasn't find for \`${devicename(codename)}\``);
      let embed = new Discord.MessageEmbed()
        .setTitle(`Pixel Experience | ${devicename(codename).split(" | ")[0]}`);
      if(!peeleven.error){
        embed.addField(`Eleven`, `**Date**: \`${timeconv(peeleven.datetime)}\`\n**Size**: \`${pretty(peeleven.size)}\`\n**MD5**: \`${peeleven.filehash}\`\n**Download**: [${peeleven.filename}](${peeleven.url})`);
      } if(!peelevenp.error){
        embed.addField(`Eleven Plus`, `**Date**: \`${timeconv(peelevenp.datetime)}\`\n**Size**: \`${pretty(peelevenp.size)}\`\n**MD5**: \`${peelevenp.filehash}\`\n**Download**: [${peelevenp.filename}](${peelevenp.url})`);
      } if(!peten.error){
        embed.addField(`Ten`, `**Date**: \`${timeconv(peten.datetime)}\`\n**Size**: \`${pretty(peten.size)}\`\n**MD5**: \`${peten.filehash}\`\n**Download**: [${peten.filename}](${peten.url})`);
      } if(!petenp.error){
        embed.addField(`Ten Plus`, `**Date**: \`${timeconv(petenp.datetime)}\`\n**Size**: \`${pretty(petenp.size)}\`\n**MD5**: \`${petenp.filehash}\`\n**Download**: [${petenp.filename}](${petenp.url})`);
      } if(!pepie.error){
        embed.addField(`Pie`, `**Date**: \`${timeconv(pepie.datetime)}\`\n**Size**: \`${pretty(pepie.size)}\`\n**MD5**: \`${pepie.filehash}\`\n**Download**: [${pepie.filename}](${pepie.url})`);
      } if(!pepiep.error){
        embed.addField(`Pie Plus`, `**Date**: \`${timeconv(pepiep.datetime)}\`\n**Size**: \`${pretty(pepiep.size)}\`\n**MD5**: \`${pepiep.filehash}\`\n**Download**: [${pepiep.filename}](${pepiep.url})`);
      }
      msg.edit("",{embed})
    } catch(e){
      console.log(e);
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["pe", "pixelexperience"],
    enable: true
  };

  command.romname = "Pixel Experience"

  command.help = {
    "category": "roms",
    "description": "Get Official "+command.romname+" for a specific device",
    "example": "{prefix}"+command.options.name[0]+" violet"
  }

  command.roms = async function(codename){
    try {
      let pepie = await fetch(`https://download.pixelexperience.org/ota_v4/${codename}/pie`).then(res => res.json());
      let pepiep = await fetch(`https://download.pixelexperience.org/ota_v4/${codename}/pie_plus`).then(res => res.json());
      let peten = await fetch(`https://download.pixelexperience.org/ota_v4/${codename}/ten`).then(res => res.json());
      let petenp = await fetch(`https://download.pixelexperience.org/ota_v4/${codename}/ten_plus`).then(res => res.json());
      let peeleven = await fetch(`https://download.pixelexperience.org/ota_v4/${codename}/eleven`).then(res => res.json());
      let peelevenp = await fetch(`https://download.pixelexperience.org/ota_v4/${codename}/eleven`).then(res => res.json());
      if(pepie.error === true && pepiep.error === true && peten.error === true && petenp.error === true && peeleven.error === true && peelevenp.error === true) return null;
      let array = [];
      if(peeleven.error !== true) array.push(`${command.romname} [Eleven] (${command.options.name.join("/")})`);
      if(peelevenp.error !== true) array.push(`${command.romname} [Eleven Plus] (${command.options.name.join("/")})`);
      if(peten.error !== true) array.push(`${command.romname} [Ten] (${command.options.name.join("/")})`);
      if(petenp.error !== true) array.push(`${command.romname} [Ten Plus] (${command.options.name.join("/")})`);
      if(pepie.error !== true) array.push(`${command.romname} [Pie] (${command.options.name.join("/")})`);
      if(pepiep.error !== true) array.push(`${command.romname} [Pie Plus] (${command.options.name.join("/")})`);
      return array
    } catch(e){
      return null;
    }
  }

  return command;
}
