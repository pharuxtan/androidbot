module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  function reverseSnapshot(snap){var reverseSnap = [];snap.forEach(function(data){var val = data.val();reverseSnap.push(val)});return reverseSnap.reverse()}

  async function command(slash){
    if(slash.bot_scope) slash.callMessageEvent();
    else {
      let codename = cdn(slash);
      if(codename == undefined) return slash.send("Please enter a codename !");
      let msg = await slash.send(`Searching Official TWRP for \`${devicename(codename)}\`...`);
      try {
        let twrpdevices = await fetch("https://twrp.me/search.json").then(res => res.json());
        let search = twrpdevices.find(cdn => cdn.title.toLowerCase().indexOf(`(${codename})`) !== -1);
        if(search !== undefined){
          const embed = new Discord.MessageEmbed()
            .setTitle(`TWRP | ${devicename(codename).split(" | ")[0]}`)
            .setDescription(`**Download**: [${search.title}](https://twrp.me${search.url})`)
          msg.edit("", {embed});
        } else {
          msg.edit(`Searching TWRP Builder for \`${devicename(codename)}\`...`);
          let snapshot = await fapp.database().ref("Builds").orderByKey().once("value");
          let search = reverseSnapshot(snapshot).find(cdn => cdn.codeName.toLowerCase() === codename);
          if(search !== undefined){
            const embed = new Discord.MessageEmbed()
              .setTitle(`TWRP Builder | ${devicename(codename).split(" | ")[0]}`)
              .setDescription(`**Download**: ${search.url}`);
            msg.edit("",{embed});
          } else {
            msg.edit(`TWRP wasn't find for \`${devicename(codename)}\``);
          }
        }
      } catch(e){
        console.log(e);
        msg.edit(`An error occured, please retry later.`);
      }
    }
  }

  command.options = {
    name: ["twrp"],
    enable: true
  };

  return command;
}
