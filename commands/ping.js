module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    let ping = new Date().getTime();
    await fetch("https://discord.com",{method:"HEAD"});
    message.channel.send(`pong! ${new Date().getTime() - ping}ms`);
  }

  command.options = {
    name: ["ping"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Sends a pong message with latency.",
    "example": "{prefix}ping"
  }

  return command;
}
