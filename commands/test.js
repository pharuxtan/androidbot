module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });
  
  async function command(message){
    message.channel.send("test ok");
  }
  
  command.options = {
    name: ["test"],
    enable: true
  };
  
  return command;
}