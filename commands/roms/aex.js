module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let msg = await message.channel.send(`Searching official AOSP Extended for \`${devicename(codename)}\`...`);
    try {
      let aexoreo = await fetch(`https://api.aospextended.com/ota_v2/${codename}/oreo`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
      let aexpie = await fetch(`https://api.aospextended.com/ota_v2/${codename}/pie`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
      let aexpieg = await fetch(`https://api.aospextended.com/ota_v2/${codename}/pie_gapps`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
      let aexten = await fetch(`https://api.aospextended.com/ota_v2/${codename}/q`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
      let aexteng = await fetch(`https://api.aospextended.com/ota_v2/${codename}/q_gapps`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
      if(aexoreo.error){
        aexoreo = await fetch(`https://api.aospextended.com/ota_v2/${codename.toUpperCase()}/oreo`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
        if(aexoreo.error){
          aexoreo = null;
        }
      } if(aexpie.error){
        aexpie = await fetch(`https://api.aospextended.com/ota_v2/${codename.toUpperCase()}/pie`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
        if(aexpie.error){
          aexpie = null;
        }
      } if(aexten.error){
        aexten = await fetch(`https://api.aospextended.com/ota_v2/${codename.toUpperCase()}/q`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
        if(aexten.error){
          aexten = null;
        }
      } if(aexpieg.error){
        aexpieg = await fetch(`https://api.aospextended.com/ota_v2/${codename.toUpperCase()}/pie_gapps`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
        if(aexpieg.error){
          aexpieg = null;
        }
      } if(aexteng.error){
        aexteng = await fetch(`https://api.aospextended.com/ota_v2/${codename.toUpperCase()}/q_gapps`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
        if(aexteng.error){
          aexteng = null;
        }
      }
      if(aexoreo == null && aexpie == null && aexten == null && aexteng == null && aexpieg == null) return msg.edit(`AOSP Extended wasn't find for \`${devicename(codename)}\``);
      let embed = new Discord.MessageEmbed()
        .setTitle(`AOSP Extended | ${devicename(codename).split(" | ")[0]}`);
      if(aexten != null){
        embed.addField(`Ten`, `**Version**: \`${aexten.filename.split("-")[1]}\`\n**Date**: \`${timeconv(aexten.datetime)}\`\n**Size**: \`${pretty(aexten.size)}\`\n**MD5**: \`${aexten.filehash}\`\n**Download**: [${aexten.filename}](${aexten.url})`)
      } if(aexteng != null){
        embed.addField(`Ten GApps`, `**Version**: \`${aexteng.filename.split("-")[1]}\`\n**Date**: \`${timeconv(aexteng.datetime)}\`\n**Size**: \`${pretty(aexteng.size)}\`\n**MD5**: \`${aexteng.filehash}\`\n**Download**: [${aexteng.filename}](${aexteng.url})`)
      } if(aexpie != null){
        embed.addField(`Pie`, `**Version**: \`${aexpie.filename.split("-")[1]}\`\n**Date**: \`${timeconv(aexpie.datetime)}\`\n**Size**: \`${pretty(aexpie.size)}\`\n**MD5**: \`${aexpie.filehash}\`\n**Download**: [${aexpie.filename}](${aexpie.url})`)
      } if(aexpieg != null){
        embed.addField(`Pie GApps`, `**Version**: \`${aexpieg.filename.split("-")[1]}\`\n**Date**: \`${timeconv(aexpieg.datetime)}\`\n**Size**: \`${pretty(aexpieg.size)}\`\n**MD5**: \`${aexpieg.filehash}\`\n**Download**: [${aexpieg.filename}](${aexpieg.url})`)
      } if(aexoreo != null){
        embed.addField(`Oreo`, `**Version**: \`${aexoreo.filename.split("-")[1]}\`\n**Date**: \`${timeconv(aexoreo.datetime)}\`\n**Size**: \`${pretty(aexoreo.size)}\`\n**MD5**: \`${aexoreo.filehash}\`\n**Download**: [${aexoreo.filename}](${aexoreo.url})`)
      }
      msg.edit("",{embed});
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["aex","aospextended"],
    enable: true
  };

  command.romname = "AOSP Extended"

  command.help = {
    "category": "roms",
    "description": "Get Official "+command.romname+" for a specific device",
    "example": "{prefix}"+command.options.name[0]+" violet"
  }

  command.roms = async function(codename){
    try {
      let aexoreo = await fetch(`https://api.aospextended.com/ota_v2/${codename}/oreo`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
      let aexpie = await fetch(`https://api.aospextended.com/ota_v2/${codename}/pie`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
      let aexpieg = await fetch(`https://api.aospextended.com/ota_v2/${codename}/pie_gapps`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
      let aexten = await fetch(`https://api.aospextended.com/ota_v2/${codename}/q`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
      let aexteng = await fetch(`https://api.aospextended.com/ota_v2/${codename}/q_gapps`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
      if(aexoreo.error){
        aexoreo = await fetch(`https://api.aospextended.com/ota_v2/${codename.toUpperCase()}/oreo`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
        if(aexoreo.error){
          aexoreo = null;
        }
      } if(aexpie.error){
        aexpie = await fetch(`https://api.aospextended.com/ota_v2/${codename.toUpperCase()}/pie`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
        if(aexpie.error){
          aexpie = null;
        }
      } if(aexten.error){
        aexten = await fetch(`https://api.aospextended.com/ota_v2/${codename.toUpperCase()}/q`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
        if(aexten.error){
          aexten = null;
        }
      } if(aexpieg.error){
        aexpieg = await fetch(`https://api.aospextended.com/ota_v2/${codename.toUpperCase()}/pie_gapps`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
        if(aexpieg.error){
          aexpieg = null;
        }
      } if(aexteng.error){
        aexteng = await fetch(`https://api.aospextended.com/ota_v2/${codename.toUpperCase()}/q_gapps`,{headers:{"User-Agent":"com.aospextended.ota"}}).then(res => res.json());
        if(aexteng.error){
          aexteng = null;
        }
      }
      if(aexoreo == null && aexpie == null && aexten == null && aexteng == null && aexpieg == null) return null;
      let array = [];
      if(aexten != null) array.push(`${command.romname} [Ten] (${command.options.name.join("/")})`);
      if(aexteng != null) array.push(`${command.romname} [Ten Gapps] (${command.options.name.join("/")})`);
      if(aexpie != null) array.push(`${command.romname} [Pie] (${command.options.name.join("/")})`);
      if(aexpieg != null) array.push(`${command.romname} [Pie Gapps] (${command.options.name.join("/")})`);
      if(aexoreo != null) array.push(`${command.romname} [Oreo] (${command.options.name.join("/")})`);
      return array
    } catch(e){
      return null
    }
  }

  return command;
}
