module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let msg = undefined;
    try{
      let codename = cdn(message);
      let files = getFiles(`${__dirname}/roms`).filter(file => file.endsWith(".js"));
      let roms = files.map(file => (require(file))(globalVariables));
      if(codename == undefined){
        let names = roms.map(rom => `${rom.romname} (${rom.options.name.join("/")})`).sort(function (a, b) {return a.toLowerCase().localeCompare(b.toLowerCase())}).join('\n');
        let embed = new Discord.MessageEmbed()
          .setTitle("Available Official ROMs")
          .setDescription(names);
        message.channel.send(embed);
      } else {
        msg = await message.channel.send(`Searching ROMs for \`${devicename(codename)}\`...`);
        let result = [];
        for(let rom of roms){
          let res = await rom.roms(codename);
          if(res != null){
            if(typeof(res) !== "string"){
              result = result.concat(res);
            } else {
              result.push(res);
            }
          }
        }
        if(result.length == 0) return msg.edit(`No ROM found for \`${devicename(codename)}\``);
        let embed = new Discord.MessageEmbed()
          .setTitle(`Official ROMs | ${devicename(codename).split(" | ")[0]}`)
          .setDescription(result.sort(function (a, b) {return a.toLowerCase().localeCompare(b.toLowerCase())}).join('\n'));
        msg.edit("",{embed});
      }
    } catch(e){
      console.log(e);
      if(msg !== undefined){
        msg.edit(`An error occured, please retry later.`);
      } else {
        message.channel.send(`An error occured, please retry later.`);
      }
    }
  }

  command.options = {
    name: ["roms"],
    enable: true
  };

  command.help = {
    "category": "roms",
    "description": "Search for a specific model on all available roms",
    "example": "{prefix}roms violet"
  }

  return command;
}
