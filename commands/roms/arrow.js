module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let msg = await message.channel.send(`Searching official ArrowOS for \`${devicename(codename)}\`...`);
    try {
      let arrowvanilla = fetch(`https://update.arrowos.net/api/v1/${codename}/official/vanilla`);
      let arrowgapps = fetch(`https://update.arrowos.net/api/v1/${codename}/official/gapps`);
      if((await arrowvanilla).status !== 200){
        arrowvanilla = null;
      } else {
        arrowvanilla = (await arrowvanilla.then(res => res.json())).response;
        if(arrowvanilla.length === 0){
          arrowvanilla = null;
        } else {
          arrowvanilla = arrowvanilla[0];
        }
      }
      if((await arrowgapps).status !== 200){
        arrowgapps = null;
      } else {
        arrowgapps = (await arrowgapps.then(res => res.json())).response;
        if(arrowgapps.length === 0){
          arrowgapps = null;
        } else {
          arrowgapps = arrowgapps[0];
        }
      }
      if(arrowvanilla == null && arrowgapps == null){
        arrowvanilla = fetch(`https://update.arrowos.net/api/v1/${codename.toUpperCase()}/official/vanilla`);
        arrowgapps = fetch(`https://update.arrowos.net/api/v1/${codename.toUpperCase()}/official/gapps`);
        if((await arrowvanilla).status !== 200){
          arrowvanilla = null;
        } else {
          arrowvanilla = (await arrowvanilla.then(res => res.json())).response;
          if(arrowvanilla.length === 0){
            arrowvanilla = null;
          } else {
            arrowvanilla = arrowvanilla[0];
          }
        }
        if((await arrowgapps).status !== 200){
          arrowgapps = null;
        } else {
          arrowgapps = (await arrowgapps.then(res => res.json())).response;
          if(arrowgapps.length === 0){
            arrowgapps = null;
          } else {
            arrowgapps = arrowgapps[0];
          }
        }
        if(arrowvanilla == null && arrowgapps == null) return msg.edit(`ArrowOS wasn't find for \`${devicename(codename)}\``);
      }
      let embed = new Discord.MessageEmbed()
        .setTitle(`ArrowOS | ${devicename(codename).split(" | ")[0]}`);
      if(arrowvanilla != null){
        embed.addField(`Vanilla`, `**Version**: \`${arrowvanilla.version}\`\n**Date**: \`${timeconv(arrowvanilla.datetime)}\`\n**Size**: \`${pretty(parseInt(arrowvanilla.size))}\`\n**Download**: [${arrowvanilla.filename}](${arrowvanilla.url})`)
      } if(arrowgapps != null){
        embed.addField(`GApps`, `**Version**: \`${arrowgapps.version}\`\n**Date**: \`${timeconv(arrowgapps.datetime)}\`\n**Size**: \`${pretty(parseInt(arrowgapps.size))}\`\n**Download**: [${arrowgapps.filename}](${arrowgapps.url})`)
      }
      msg.edit("",{embed});
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["arrow","arrowos"],
    enable: true
  };

  command.romname = "ArrowOS"

  command.help = {
    "category": "roms",
    "description": "Get Official "+command.romname+" for a specific device",
    "example": "{prefix}"+command.options.name[0]+" violet"
  }

  command.roms = async function(codename){
    try {
      let arrowvanilla = fetch(`https://update.arrowos.net/api/v1/${codename}/official/vanilla`);
      let arrowgapps = fetch(`https://update.arrowos.net/api/v1/${codename}/official/gapps`);
      if((await arrowvanilla).status !== 200){
        arrowvanilla = null;
      } else {
        arrowvanilla = (await arrowvanilla.then(res => res.json())).response;
        if(arrowvanilla.length === 0){
          arrowvanilla = null;
        } else {
          arrowvanilla = arrowvanilla[0];
        }
      }
      if((await arrowgapps).status !== 200){
        arrowgapps = null;
      } else {
        arrowgapps = (await arrowgapps.then(res => res.json())).response;
        if(arrowgapps.length === 0){
          arrowgapps = null;
        } else {
          arrowgapps = arrowgapps[0];
        }
      }
      if(arrowvanilla == null && arrowgapps == null){
        arrowvanilla = fetch(`https://update.arrowos.net/api/v1/${codename.toUpperCase()}/official/vanilla`);
        arrowgapps = fetch(`https://update.arrowos.net/api/v1/${codename.toUpperCase()}/official/gapps`);
        if((await arrowvanilla).status !== 200){
          arrowvanilla = null;
        } else {
          arrowvanilla = (await arrowvanilla.then(res => res.json())).response;
          if(arrowvanilla.length === 0){
            arrowvanilla = null;
          } else {
            arrowvanilla = arrowvanilla[0];
          }
        }
        if((await arrowgapps).status !== 200){
          arrowgapps = null;
        } else {
          arrowgapps = (await arrowgapps.then(res => res.json())).response;
          if(arrowgapps.length === 0){
            arrowgapps = null;
          } else {
            arrowgapps = arrowgapps[0];
          }
        }
        if(arrowvanilla == null && arrowgapps == null) return null;
      }
      let array = [];
      if(arrowvanilla != null) array.push(`${command.romname} [Vanilla] (${command.options.name.join("/")})`);
      if(arrowgapps != null) array.push(`${command.romname} [GApps] (${command.options.name.join("/")})`);
      return array
    } catch(e){
      return null;
    }
  }

  return command;
}
