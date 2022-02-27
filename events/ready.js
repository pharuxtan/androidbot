module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });
  
  function event(){
    console.log(bot.user.username);
  }
  
  event.listener = "ready";
  
  return event;
}