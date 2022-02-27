module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    if(message.author.id !== "254326758864715777") return;
    try {
      if(message.content.split(" ")[1] == "exit") return message.channel.send(`Restarting Bot...`).then(r => process.exit(0));
      let msg;
      if(message.content.split(" ")[1] == "events"){
        msg = await message.channel.send(`Restarting Events...`);
        for(let listener of listeners){
          client.removeListener(listener[0], listener[1]);
        }
        listeners = [];
        let events = getFiles(__dirname+"/../../events").filter(f => f.endsWith(".js"));
        events.map(event => {
          delete require.cache[require.resolve(event)];
          let func = require(event)(globalVariables);
          listeners.push([func.listener,func]);
          client.on(func.listener, func);
        });
      } else if(message.content.split(" ")[1] == "globalvar"){
        msg = await message.channel.send(`Restarting Global Variables...`);
        let file = __dirname+"/../../initGlobalVariable.js";
        delete require.cache[require.resolve(file)];
        require(file)(globalVariables);
      } else if(message.content.split(" ")[1] == "slashes"){
        msg = await message.channel.send(`Restarting Slashes Commands...`);
        let commands = getFiles(__dirname+"/../slashes/commands").filter(f => f.endsWith(".js"));
        for(let i in commands){
          delete require.cache[require.resolve(commands[i])];
          require(commands[i]);
        }
      } else if(message.content.split(" ")[1] == "autolaunch"){
        msg = await message.channel.send(`Restarting Auto Launch Programs...`);
        for(let interval of autol){
          clearInterval(interval);
        }
        globalVariables.autol = [];
        let launchs = getFiles(__dirname+"/../../autolaunch").filter(f => f.endsWith(".js"));
        launchs.map(file => globalVariables.autol.push((require(file)(globalVariables))()));
      } else {
        msg = await message.channel.send(`Restarting Commands...`);
        let commands = getFiles(__dirname+"/..").filter(n => n.endsWith(".js"));
        for(let i in commands){
          delete require.cache[require.resolve(commands[i])];
          require(commands[i]);
        }
      }
      msg.edit("Restart finished");
    } catch(e){
      console.log(e);
      message.channel.send(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["reboot","restart"],
    enable: true
  };

  return command;
}
