module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  function event(){
    console.log(bot.user.username);
    client.user.setPresence({activity:{name:`.help`,type:'PLAYING'},status:'online'})
    setInterval(()=>{ client.user.setPresence({activity:{name:`.help`,type:'PLAYING'},status:'online'}) },60000);
    setInterval(() => {
      fetch("https://top.gg/api/bots/572002884552491008/stats",{method:"POST",body:JSON.stringify({server_count:client.guilds.cache.size}),headers:{'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3MjAwMjg4NDU1MjQ5MTAwOCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTg4OTIxMzAzfQ.TgYJtqHDKWayOI5ov4nT2wpGFQ9k43xu5tilgTnvWxc',"Content-Type":"application/json"}})
      var user = client.user;
      let num=0,sizes = client.guilds.cache.map(n => n.memberCount);
      for(let i=0; i<sizes.length; i++){
        num+=sizes[i];
      }
      fetch("https://discordbotlist.com/api/bots/572002884552491008/stats",{method:"POST",body:JSON.stringify({guilds:client.guilds.cache.size,users:num,voice_connections:0}),headers:{'Authorization': 'Bot 96b2954d66d889117f797c599e11cf5f264d44f0e48a4cda72cca80deb719d4f',"Content-Type":"application/json"}})
    }, 1800000);
  }

  event.listener = "ready";

  return event;
}
