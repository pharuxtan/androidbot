const globalVariables = {};
require("./initGlobalVariable.js")(globalVariables);
Object.keys(globalVariables).map(variable => {
  global[variable] = globalVariables[variable];
});

client.setMaxListeners(Infinity);
client.ws.setMaxListeners(Infinity);

require("./slashes/slashes.js")(globalVariables);

//preload commands
if(fs.existsSync(__dirname+"/commands")){
    let commands = getFiles(__dirname+"/commands").filter(n => n.endsWith(".js"));
    for(let i=0; i<commands.length; i++) require(commands[i]);
}

let autolaunch = getFiles(__dirname + "/autolaunch").filter(f => f.endsWith(".js"));

autolaunch.map(file => autol.push((require(file)(globalVariables))()));

let events = getFiles(__dirname + "/events").filter(f => f.endsWith(".js"));

events.map(event => {
  let func = require(event)(globalVariables);
  listeners.push([func.listener,func]);
  client.on(func.listener, func);
});

client.login("token");
