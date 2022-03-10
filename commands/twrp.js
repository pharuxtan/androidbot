module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  function reverseSnapshot(snap){var reverseSnap = [];snap.forEach(function(data){var val = data.val();reverseSnap.push(val)});return reverseSnap.reverse()}

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let msg = await message.channel.send(`Searching Official TWRP for \`${devicename(codename)}\`...`);
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
          msg.edit(`TWRP wasn't found for \`${devicename(codename)}\``);
        }
      }
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["twrp"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Search Official TWRP and TWRP Builder with a specific model",
    "example": "{prefix}twrp violet"
  }

  return command;
}
