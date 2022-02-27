module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let msg = await message.channel.send(`Searching official AOSiP for \`${devicename(codename)}\`...`);
    try {
      let aosipalpha = fetch(`https://aosip.dev/${codename}/alpha`);
      let aosipofficial = fetch(`https://aosip.dev/${codename}/official`);
      if((await aosipalpha).status !== 200){
        aosipalpha = null;
      } else {
        aosipalpha = (await aosipalpha.then(res => res.json())).response;
        if(aosipalpha.length === 0){
          aosipalpha = null;
        } else {
          aosipalpha = aosipalpha[0];
        }
      }
      if((await aosipofficial).status !== 200){
        aosipofficial = null;
      } else {
        aosipofficial = (await aosipofficial.then(res => res.json())).response;
        if(aosipofficial.length === 0){
          aosipofficial = null;
        } else {
          aosipofficial = aosipofficial[0];
        }
      }
      if(aosipalpha == null && aosipofficial == null){
        aosipalpha = fetch(`https://aosip.dev/${codename.toUpperCase()}/alpha`);
        aosipofficial = fetch(`https://aosip.dev/${codename.toUpperCase()}/official`);
        if((await aosipalpha).status !== 200){
          aosipalpha = null;
        } else {
          aosipalpha = (await aosipalpha.then(res => res.json())).response;
          if(aosipalpha.length == 0){
            aosipalpha = null;
          } else {
            aosipalpha = aosipofficial[0];
          }
        }
        if((await aosipofficial).status !== 200){
          aosipofficial = null;
        } else {
          aosipofficial = (await aosipofficial.then(res => res.json())).response;
          if(aosipofficial.length == 0){
            aosipofficial = null;
          } else {
            aosipofficial = aosipofficial[0];
          }
        }
        if(aosipalpha == null && aosipofficial == null) return msg.edit(`AOSiP wasn't find for \`${devicename(codename)}\``);
      }
      let embed = new Discord.MessageEmbed()
        .setTitle(`AOSiP | ${devicename(codename).split(" | ")[0]}`);
      if(aosipalpha != null){
        embed.addField(`Alpha`, `**Version**: \`${aosipalpha.version}\`\n**Date**: \`${timeconv(aosipalpha.datetime)}\`\n**Size**: \`${pretty(aosipalpha.size)}\`\n**Download**: [${aosipalpha.filename}](${aosipalpha.url})`)
      } if(aosipofficial != null){
        embed.addField(`Official`, `**Version**: \`${aosipofficial.version}\`\n**Date**: \`${timeconv(aosipofficial.datetime)}\`\n**Size**: \`${pretty(aosipofficial.size)}\`\n**Download**: [${aosipofficial.filename}](${aosipofficial.url})`)
      }
      msg.edit("",{embed})
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["aosip"],
    enable: true
  };

  command.romname = "Android Open Source illusion Project"

  command.help = {
    "category": "roms",
    "description": "Get Official "+command.romname+" for a specific device",
    "example": "{prefix}"+command.options.name[0]+" violet"
  }

  command.roms = async function(codename){
    try {
      let aosipalpha = fetch(`https://aosip.dev/${codename}/alpha`);
      let aosipofficial = fetch(`https://aosip.dev/${codename}/official`);
      if((await aosipalpha).status !== 200){
        aosipalpha = null;
      } else {
        aosipalpha = (await aosipalpha.then(res => res.json())).response;
        if(aosipalpha.length === 0){
          aosipalpha = null;
        } else {
          aosipalpha = aosipalpha[0];
        }
      }
      if((await aosipofficial).status !== 200){
        aosipofficial = null;
      } else {
        aosipofficial = (await aosipofficial.then(res => res.json())).response;
        if(aosipofficial.length === 0){
          aosipofficial = null;
        } else {
          aosipofficial = aosipofficial[0];
        }
      }
      if(aosipalpha == null && aosipofficial == null){
        aosipalpha = fetch(`https://aosip.dev/${codename.toUpperCase()}/alpha`);
        aosipofficial = fetch(`https://aosip.dev/${codename.toUpperCase()}/official`);
        if((await aosipalpha).status !== 200){
          aosipalpha = null;
        } else {
          aosipalpha = (await aosipalpha.then(res => res.json())).response;
          if(aosipalpha.length == 0){
            aosipalpha = null;
          } else {
            aosipalpha = aosipofficial[0];
          }
        }
        if((await aosipofficial).status !== 200){
          aosipofficial = null;
        } else {
          aosipofficial = (await aosipofficial.then(res => res.json())).response;
          if(aosipofficial.length == 0){
            aosipofficial = null;
          } else {
            aosipofficial = aosipofficial[0];
          }
        }
        if(aosipalpha == null && aosipofficial == null) return null;
      }
      let array = [];
      if(aosipalpha != null) array.push(`${command.romname} [Alpha] (${command.options.name.join("/")})`);
      if(aosipofficial != null) array.push(`${command.romname} [Official] (${command.options.name.join("/")})`);
      return array
    } catch(e){
      return null
    }
  }

  return command;
}
