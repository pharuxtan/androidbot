module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });
  
  async function command(slash){
    slash.callMessageEvent();
  }
  
  command.options = {
    name: ["test"],
    enable: true
  };
  
  return command;
}