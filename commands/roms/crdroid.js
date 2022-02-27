module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let msg = await message.channel.send(`Searching official crDroid for \`${devicename(codename)}\`...`);
    try {
      let crdroid = fetch(`https://raw.githubusercontent.com/crdroidandroid/android_vendor_crDroidOTA/10.0/${codename}.json`);
      if((await crdroid).status !== 200){
        crdroid = fetch(`https://raw.githubusercontent.com/crdroidandroid/android_vendor_crDroidOTA/10.0/${codename.toUpperCase()}.json`);
        if((await crdroid).status !== 200){
          return msg.edit(`crDroid wasn't find for \`${devicename(codename)}\``);
        } else {
          crdroid = (await crdroid.then(res => res.json())).response[0];
        }
      } else {
        crdroid = (await crdroid.then(res => res.json())).response[0];
      }
      let embed = new Discord.MessageEmbed()
        .setTitle(`crDroid | ${devicename(codename).split(" | ")[0]}`)
        .setDescription(`**Version**: \`${crdroid.version}\`\n**Date**: \`${timeconv(crdroid.timestamp)}\`\n**Size**: \`${pretty(crdroid.size)}\`\n**MD5**: \`${crdroid.md5}\`\n**Download**: [${crdroid.filename}](${crdroid.download})`);
      msg.edit("",{embed});
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["crdroid"],
    enable: true
  };

  command.romname = "crDroid"

  command.help = {
    "category": "roms",
    "description": "Get Official "+command.romname+" for a specific device",
    "example": "{prefix}"+command.options.name[0]+" violet"
  }

  command.roms = async function(codename){
    try {
      let crdroid = fetch(`https://raw.githubusercontent.com/crdroidandroid/android_vendor_crDroidOTA/10.0/${codename}.json`);
      if((await crdroid).status !== 200){
        crdroid = fetch(`https://raw.githubusercontent.com/crdroidandroid/android_vendor_crDroidOTA/10.0/${codename.toUpperCase()}.json`);
        if((await crdroid).status !== 200){
          return null;
        } else {
          crdroid = (await crdroid.then(res => res.json())).response[0];
        }
      } else {
        crdroid = (await crdroid.then(res => res.json())).response[0];
      }
      return `${command.romname} (${command.options.name.join("/")})`;
    } catch(e){
      return null;
    }
  }

  return command;
}
