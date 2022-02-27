module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });
  
  async function command(message){
    if(message.author.id !== "OWNER_ID") return;
    if(message.content.split(" ")[1] == "exit") return message.channel.send(`Restarting Bot...`).then(r => process.exit(0));
    let msg;
    if(message.content.split(" ")[1] == "events"){
      msg = await message.channel.send(`Restarting Events...`);
      for(let listener of listeners){
        client.removeListener(listener[0], listener[1]);
      }
      listeners = [];
      let events = getFiles(__dirname+"/../events").filter(f => f.endsWith(".js"));
      events.map(event => {
        delete require.cache[require.resolve(event)];
        let func = require(event)(globalVariables);
        listeners.push([func.listener,func]);
        client.on(func.listener, func);
      });
    } else if(message.content.split(" ")[1] == "globalvar"){
      msg = await message.channel.send(`Restarting Global Variables...`);
      let file = __dirname+"/../initGlobalVariable.js";
      delete require.cache[require.resolve(file)];
      require(file)(globalVariables);
    } else if(message.content.split(" ")[1] == "slashes"){
      msg = await message.channel.send(`Restarting Slashes Commands...`);
      let commands = getFiles(__dirname+"/../slashes/commands").filter(f => f.endsWith(".js"));
      for(let i in commands){
        delete require.cache[require.resolve(commands[i])];
        require(commands[i]);
      }
    } else {
      msg = await message.channel.send(`Restarting Commands...`);
      let commands = getFiles(__dirname).filter(f => f.endsWith(".js"));
      for(let i in commands){
        delete require.cache[require.resolve(commands[i])];
        require(commands[i]);
      }
    }
    msg.edit("Restart finished");
  }
  
  command.options = {
    name: ["restart","reboot"],
    enable: true
  };
  
  return command;
}