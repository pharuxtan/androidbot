module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  function reverseSnapshot(snap){var reverseSnap = [];snap.forEach(function(data){var val = data.val();reverseSnap.push(val)});return reverseSnap.reverse()}

  async function command(message){
    try {
      var cdn = message.content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(' ')[1]
      if(device[cdn.toLowerCase()] !== undefined){
        return message.channel.send("This codename corresponds to `"+device[cdn.toLowerCase()].join("` - `")+"`");
      } else {
        return message.channel.send("No phones found for `"+cdn+"`");
      }
    } catch(e){
      message.channel.send(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["getphone"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Get the phones name with a codename",
    "example": "{prefix}getphone violet"
  }

  return command;
}
