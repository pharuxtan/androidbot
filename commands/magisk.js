module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    try{
      var magisk = message.content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(' ')[1];
      let embed = new Discord.MessageEmbed();
      if(magisk == "stable"){
        let stable = await fetch("https://raw.githubusercontent.com/topjohnwu/magisk_files/master/stable.json").then(res => res.json());
        embed.setTitle("Magisk Stable");
        embed.setDescription(`[Magisk Manager ${stable.app.version} \`${stable.app.versionCode}\`](${stable.app.link})\n[Magisk ${stable.magisk.version} \`${stable.magisk.versionCode}\`](${stable.magisk.link})\n[STUB \`${stable.stub.versionCode}\`](${stable.stub.link})\n[Magisk uninstaller](${stable.uninstaller.link})`);
      } else if(magisk == "beta"){
        let stable = await fetch("https://raw.githubusercontent.com/topjohnwu/magisk_files/master/beta.json").then(res => res.json());
        embed.setTitle("Magisk Beta");
        embed.setDescription(`[Magisk Manager ${stable.app.version} \`${stable.app.versionCode}\`](${stable.app.link})\n[Magisk ${stable.magisk.version} \`${stable.magisk.versionCode}\`](${stable.magisk.link})\n[STUB \`${stable.stub.versionCode}\`](${stable.stub.link})\n[Magisk uninstaller](${stable.uninstaller.link})`);
      } else if(magisk == "canary"){
        let stable = await fetch("https://raw.githubusercontent.com/topjohnwu/magisk_files/canary/canary.json").then(res => res.json());
        embed.setTitle("Magisk Canary");
        embed.setDescription(`[Magisk Manager ${stable.app.version} \`${stable.app.versionCode}\`](https://raw.githubusercontent.com/topjohnwu/magisk_files/canary/${stable.app.link})\n[Magisk ${stable.magisk.version} \`${stable.magisk.versionCode}\`](https://raw.githubusercontent.com/topjohnwu/magisk_files/canary/${stable.magisk.link})\n[STUB \`${stable.stub.versionCode}\`](https://raw.githubusercontent.com/topjohnwu/magisk_files/canary/${stable.stub.link})\n[Magisk uninstaller](https://raw.githubusercontent.com/topjohnwu/magisk_files/canary/${stable.uninstaller.link})`);
      } else {
        let stable = await fetch("https://raw.githubusercontent.com/topjohnwu/magisk_files/master/stable.json").then(res => res.json());
        let beta = await fetch("https://raw.githubusercontent.com/topjohnwu/magisk_files/master/beta.json").then(res => res.json());
        let canaryd = await fetch("https://raw.githubusercontent.com/topjohnwu/magisk_files/canary/canary.json").then(res => res.json());
        embed.setTitle("Magisk");
        embed.addFields([
          {name:"Stable",value:`[Magisk Manager ${stable.app.version} \`${stable.app.versionCode}\`](${stable.app.link})\n[Magisk ${stable.magisk.version} \`${stable.magisk.versionCode}\`](${stable.magisk.link})\n[STUB \`${stable.stub.versionCode}\`](${stable.stub.link})\n[Magisk uninstaller](${stable.uninstaller.link})`,inline:true},
          {name:"Beta",value:`[Magisk Manager ${beta.app.version} \`${beta.app.versionCode}\`](${beta.app.link})\n[Magisk ${beta.magisk.version} \`${beta.magisk.versionCode}\`](${beta.magisk.link})\n[STUB \`${beta.stub.versionCode}\`](${beta.stub.link})\n[Magisk uninstaller](${beta.uninstaller.link})`,inline:true},
          {name:"Canary",value:`[Magisk Manager ${canaryd.app.version} \`${canaryd.app.versionCode}\`](https://raw.githubusercontent.com/topjohnwu/magisk_files/canary/${canaryd.app.link})\n[Magisk ${canaryd.magisk.version} \`${canaryd.magisk.versionCode}\`](https://raw.githubusercontent.com/topjohnwu/magisk_files/canary/${canaryd.magisk.link})\n[STUB \`${canaryd.stub.versionCode}\`](https://raw.githubusercontent.com/topjohnwu/magisk_files/canary/${canaryd.stub.link})\n[Magisk uninstaller](https://raw.githubusercontent.com/topjohnwu/magisk_files/canary/${canaryd.uninstaller.link})`,inline:true}
        ]);
      }
      message.channel.send(embed);
    } catch(e){
      console.log(e);
      message.channel.send(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["magisk"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Search Magisk",
    "example": "{prefix}magisk\n{prefix}magisk stable\n{prefix}magisk beta\n{prefix}magisk canary\n{prefix}magisk canary release/debug"
  }

  return command;
}
