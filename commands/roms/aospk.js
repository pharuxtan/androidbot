module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let msg = await message.channel.send(`Searching official AOSPK for \`${devicename(codename)}\`...`);
    try {
      let vurl = `https://raw.githubusercontent.com/AOSPK/official_devices/master/builds/eleven/vanilla/${codename}.json`;
      let vanilla = await fetch(`https://raw.githubusercontent.com/AOSPK/official_devices/master/builds/eleven/vanilla/${codename}.json`);
      if(vanilla.status != 200){
        vanilla = await fetch(`https://raw.githubusercontent.com/AOSPK/official_devices/master/builds/eleven/vanilla/${codename.toUpperCase()}.json`);
        vurl = `https://raw.githubusercontent.com/AOSPK/official_devices/master/builds/eleven/vanilla/${codename.toUpperCase()}.json`
        if(vanilla.status != 200) vanilla = null;
      }
      if(vanilla != null) vanilla = (await fetch(vurl).then(res => res.json())).response.slice(-1)[0];
      let gurl = `https://raw.githubusercontent.com/AOSPK/official_devices/master/builds/eleven/gapps/${codename}.json`;
      let gapps = await fetch(`https://raw.githubusercontent.com/AOSPK/official_devices/master/builds/eleven/gapps/${codename}.json`);
      if(gapps.status != 200){
        gapps = await fetch(`https://raw.githubusercontent.com/AOSPK/official_devices/master/builds/eleven/gapps/${codename.toUpperCase()}.json`);
        gurl = `https://raw.githubusercontent.com/AOSPK/official_devices/master/builds/eleven/gapps/${codename.toUpperCase()}.json`
        if(gapps.status != 200) gapps = null;
      }
      if(gapps != null) gapps = (await fetch(gurl).then(res => res.json())).response.slice(-1)[0];
      if(gapps == null && vanilla == null) return msg.edit(`AOSPK wasn't find for \`${devicename(codename)}\``);
      let embed = new Discord.MessageEmbed()
        .setTitle(`AOSPK | ${devicename(codename).split(" | ")[0]}`)
        .setDescription(`**Version**: \`${vanilla.version}\`\n**Date**: \`${timeconv(Number(vanilla.datetime))}\``);
      if(vanilla != null) embed.addField(vanilla.filename, `**Size**: \`${pretty(Number(vanilla.size))}\`\n[Download Here](${vanilla.url})`);
      if(gapps != null) embed.addField(gapps.filename, `**Size**: \`${pretty(Number(gapps.size))}\`\n[Download Here](${gapps.url})`);
      msg.edit("",{embed});
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["aospk"],
    enable: true
  };

  command.romname = "AOSPK"

  command.help = {
    "category": "roms",
    "description": "Get Official "+command.romname+" for a specific device",
    "example": "{prefix}"+command.options.name[0]+" lavender"
  }

  command.roms = async function(codename){
    try {
      let vanilla = await fetch(`https://raw.githubusercontent.com/AOSPK/official_devices/master/builds/eleven/vanilla/${codename}.json`);
      if(vanilla.status != 200){
        vanilla = await fetch(`https://raw.githubusercontent.com/AOSPK/official_devices/master/builds/eleven/vanilla/${codename.toUpperCase()}.json`);
        if(vanilla.status != 200) vanilla = null;
      }
      let gapps = await fetch(`https://raw.githubusercontent.com/AOSPK/official_devices/master/builds/eleven/gapps/${codename}.json`);
      if(gapps.status != 200){
        gapps = await fetch(`https://raw.githubusercontent.com/AOSPK/official_devices/master/builds/eleven/gapps/${codename.toUpperCase()}.json`);
        if(gapps.status != 200) gapps = null;
      }
      if(gapps == null && vanilla == null) return null;
      let array = [];
      if(vanilla != null) array.push(`${command.romname} [Vanilla] (${command.options.name.join("/")})`);
      if(gapps != null) array.push(`${command.romname} [GApps] (${command.options.name.join("/")})`);
      return array;
    } catch(e){
      return null;
    }
  }

  return command;
}
