module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    if(message.author.id !== "254326758864715777") return;
    client.user.setPresence({activity:{name:`.help`,type:'PLAYING'},status:'online'});
  }

  command.options = {
    name: ["status"],
    enable: true
  };

  return command;
}
