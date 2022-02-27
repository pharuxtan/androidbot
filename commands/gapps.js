module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    try {
      const gapps = await fetch("https://raw.githubusercontent.com/Pharuxtan/OpenGappsFetcher/master/gapps.json").then(res => res.json());
  		const archs = Object.keys(gapps);
      const arch = message.content.split(" ")[1];
      if(arch == undefined || !archs.includes(arch)){
        message.channel.send(`Please enter an architecture ! \`${archs.join("` - `")}\``);
      } else {
  			const ver = message.content.split(' ')[2];
  			const vers = Object.keys(gapps[arch]);
        if(ver == undefined || !vers.includes(ver)){
          message.channel.send(`Please enter a version ! \`${vers.join("` - `")}\``);
        } else {
  			  const variant = message.content.split(' ')[3];
				  const variants = gapps[arch][ver]["variant"];
          if(variant == undefined || !variants.includes(variant)){
            message.channel.send(`Please enter a variant ! \`${variants.join("` - `")}\``);
          } else {
            let gfile = gapps[arch][ver]["downloads"][variant];
  					const embed = new Discord.MessageEmbed()
  						.setTitle('OpenGapps')
  						.setDescription(`**Date**: \`${gfile.name.split("-")[4].substring(0, 4)}-${gfile.name.split("-")[4].substring(4, 6)}-${gfile.name.split("-")[4].substring(6, 8)}\`\n**Size**: \`${pretty(gfile.size)}\`\n**MD5**: \`${gfile.md5}\`\n**Download**: [${gfile.name}](${gfile.download.replace("{time}", Math.floor(Date.now() / 1000))})`)
  					message.channel.send(embed)
          }
        }
      }
    } catch(e){
      message.channel.send(`An error occured, please retry later.`);
      console.log(e);
    }
  }

  command.options = {
    name: ["gapps"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Search OpenGApps",
    "example": "{prefix}gapps arm64 10.0 nano"
  }

  return command;
}
