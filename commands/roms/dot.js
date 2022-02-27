module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let msg = await message.channel.send(`Searching official DotOS for \`${devicename(codename)}\`...`);
    try {
      let res = await fetch(`https://raw.githubusercontent.com/DotOS/website_api/master/devices/${codename}.json`);
      if(res == 404) res = await fetch(`https://raw.githubusercontent.com/DotOS/website_api/master/devices/${codename.toUpperCase()}.json`);
      if(res == 404) return msg.edit(`DotOS wasn't find for \`${devicename(codename)}\``);
      let dot = (await res.json()).builds;
      let embed = new Discord.MessageEmbed()
        .setTitle(`DotOS | ${devicename(codename).split(" | ")[0]}`);
      if(dot.gapps[0].filename != ""){
        dot.gapps = dot.gapps[0]
        embed.addField(`Gapps`, `**Version**: \`${dot.gapps.version}\`\n**Date**: \`${timeconv(parseInt(dot.gapps.datetime))}\`\n**Size**: \`${pretty(parseInt(dot.gapps.size))}\`\n**MD5**: \`${dot.gapps.id}\`\n**Download**: [${dot.gapps.filename}](${dot.gapps.url})`)
      } if(dot.vanilla[0].filename != ""){
        dot.vanilla = dot.vanilla[0]
        embed.addField(`Vanilla`, `**Version**: \`${dot.vanilla.version}\`\n**Date**: \`${timeconv(parseInt(dot.vanilla.datetime))}\`\n**Size**: \`${pretty(parseInt(dot.vanilla.size))}\`\n**MD5**: \`${dot.vanilla.id}\`\n**Download**: [${dot.vanilla.filename}](${dot.vanilla.url})`)
      }
      msg.edit("",{embed});
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["dot","dotos"],
    enable: true
  };

  command.romname = "DotOS"

  command.help = {
    "category": "roms",
    "description": "Get Official "+command.romname+" for a specific device",
    "example": "{prefix}"+command.options.name[0]+" violet"
  }

  command.roms = async function(codename){
    try {
      let res = await fetch(`https://raw.githubusercontent.com/DotOS/website_api/master/devices/${codename}.json`);
      if(res == 404) res = await fetch(`https://raw.githubusercontent.com/DotOS/website_api/master/devices/${codename.toUpperCase()}.json`);
      if(res == 404) return null
      let dot = (await res.json()).builds;
      let array = [];
      if(dot.gapps[0].filename != "") array.push(`${command.romname} [Gapps] (${command.options.name.join("/")})`);
      if(dot.vanilla[0].filename != "") array.push(`${command.romname} [Vanilla] (${command.options.name.join("/")})`);
      return array
    } catch(e){
      return null
    }
  }

  return command;
}
