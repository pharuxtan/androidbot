module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  function event(deletedGuild){
    if(globalVariables.guild[deletedGuild.id] != undefined){
      delete globalVariables.guild[deletedGuild.id]
      fs.writeFileSync(__dirname+"/../guild.json",JSON.stringify(globalVariables.guild),"utf8");
    }
  }

  event.listener = "guildDelete";

  return event;
}
