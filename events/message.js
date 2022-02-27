module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  const cooldownchan = new Set();

  function cool(message){
    if(message.channel.type !== "dm"){
      if(message.guild.id === "221706949786468353"){
        if(message.channel.id !== "342053200746250243") {
          if(cooldownchan.has(1)){
            return true;
          } else {
            cooldownchan.add(1);
            setTimeout(() => {
              cooldownchan.delete(1);
            }, 60000);
            return false;
          }
        } else {
          return false;
        }
      }
    }
  }

  function event(message){
    if(message.author.bot) return;
    let prefix = ".";
    if(message.channel.type !== "dm"){
      if(guild[message.guild.id] == undefined){
        globalVariables.guild[message.guild.id] = guild[message.guild.id] = {prefix:"."};
        fs.writeFileSync(__dirname+"/../guild.json",JSON.stringify(globalVariables.guild),"utf8");
      } else if(guild[message.guild.id].prefix == undefined) {
        globalVariables.guild[message.guild.id].prefix = ".";
        fs.writeFileSync(__dirname+"/../guild.json",JSON.stringify(globalVariables.guild),"utf8");
      } else {
        prefix = guild[message.guild.id].prefix
      }
    }
    if(message.slash) message.content = prefix + message.content;
    let commands = getFiles(__dirname+"/../commands").filter(n => n.endsWith(".js"));
    if(message.content.toLowerCase().split(" ")[0] === prefix+"help" || `${message.content.toLowerCase().split(" ")[0]} ${message.content.toLowerCase().split(" ")[1]}` === "<@!572002884552491008> help"){
      commands = commands.filter(c => c.indexOf("owner") === -1);
      if(message.content.toLowerCase().startsWith("<@!572002884552491008> help")) message.content = message.content.split(" ").slice(1).join(" ");
      let comds = commands.map(c => (require(c)(globalVariables)));
      let cmds = comds.map(c => c.options.name);
      let cmd = message.content.split(" ")[1];
      let g = null;
      for(let a in cmds){
        for(let b in cmds[a]){
          if(cmds[a][b] === cmd){
            g = comds.find(c => c.options.name[0] == cmds[a][0]);
            break;
          }
        }
      }
      if(g !== null){
        let e = new Discord.MessageEmbed()
          .setTitle(`Command ${g.options.name[0]}`)
          .setDescription(g.help.description)
          .addField("Example", g.help.example.replace(/\{prefix\}/g, prefix), true);
        if(g.options.name.length > 1){
          e.addField("Aliases", g.options.name.slice(1).join("\n"))
        }
        message.channel.send(e);
      } else {
        let e = new Discord.MessageEmbed()
          .setTitle("Commands")
          .setDescription(`For more details do \`${prefix}help [command]\`\nNote: it's recommended to do it here, because on a server other bots may respond to the help command as well.`)
          .addField("Global", "`"+comds.filter(c => c.help.category === "global").map(c => c.options.name[0]).join("` `")+"`")
          .addField("ROMs", "`"+comds.filter(c => c.help.category === "roms").map(c => c.options.name[0]).join("` `")+"`\n\nThe bot support now the new [slashes commands](https://discord.com/developers/docs/interactions/slash-commands) ! Do "+prefix+"invite to reinvite de bot in your server (no need to kick him) and enable the feature");
        message.author.send(e).then(e => {
          if(message.channel.type !== "dm") message.channel.send("Help was sent to you in pm");
        }).catch(e => {
          message.channel.send("Be sure your pm is not blocked before do this command");
        });
      }
      return
    }
    for(let i=0; i<commands.length; i++){
      let command = require(commands[i])(globalVariables);
      for(let n=0; n<command.options.name.length; n++){
        if(message.channel.type !== "dm" && message.guild.id === "221706949786468353"){
          if((message.content.toLowerCase().startsWith(prefix+"specs") || message.content.toLowerCase().startsWith(prefix+"miui")) && !message.slash) return;
        }
        if(message.content.toLowerCase().split(" ")[0] === prefix+command.options.name[n].toLowerCase() && command.options.enable){
          if(cool(message)) return;
          message.content = message.content.replace(/`|\n|\r/g, "");
          return command(message);
        }
        if(`${message.content.toLowerCase().split(" ")[0]} ${message.content.toLowerCase().split(" ")[1]}` === `<@!572002884552491008> ${command.options.name[n].toLowerCase()}` && command.options.enable){
          if(cool(message)) return;
          message.content = message.content.split(" ").slice(1).join(" ").replace(/`|\n|\r/g, "");
          return command(message);
        }
      }
    }
  }

  event.listener = "message";

  return event;
}
