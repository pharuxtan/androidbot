module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  function func(message){
    return setInterval(async function(){
      let devices = {};
      function cleanup(str){
        if(!str) return str;
        str = str.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').trim();
        if(str.indexOf("\\x") !== -1){
          var hex = str.split("\\x").slice(1);
          var txt = str.split("\\x")[1];
          for(var i = 0; i < hex.length; i++){
            var h;
            if(hex[i].length > 2){
              h = hex[i].substring(0, 2)
            } else {
              h = hex[i]
            }
            txt += String.fromCharCode(parseInt(h,16));
          }
          if(hex[hex.length - 1].length !== 2){
            txt += hex[hex.length - 1].substr(2)
          }
          str = txt;
        }
        return str;
      }
      const {parse} = require('node-html-parser');
      const html = await fetch("https://storage.googleapis.com/play_public/supported_devices.html").then(res => res.text());
      const table = parse(html).childNodes.find(child => child.tagName == "table").childNodes.filter(child => child.nodeType !== 3).slice(1);
      let supported = [];
      table.map(tr => {tr = tr.childNodes.filter(child => child.nodeType !== 3);let device = [];tr.map(th => {try{device.push(th.childNodes[0].rawText);} catch(e) {device.push("");}});supported.push(device);});
      supported.map(parts => {
        if(parts.length === 4){
          if(parts[0] === "Samsung" && cleanup(parts[1]).toLowerCase().search("chromebook") === -1){
            if(cleanup(parts[1]).toLowerCase().search(cleanup(parts[0]).toLowerCase()) !== -1){
              if(cleanup(parts[3]).toLowerCase().search(cleanup(parts[1]).toLowerCase()) === -1){
                devices[parts[3].toLowerCase()] = cleanup(`\`${parts[2].toLowerCase()}\`: ${parts[1]} (${parts[3]})`)
              } else {
                devices[parts[3].toLowerCase()] = cleanup(`\`${parts[2].toLowerCase()}\`: ${parts[1]} (${parts[3]})`)
              }
            } else {
              if(cleanup(parts[3]).toLowerCase().search(cleanup(parts[1]).toLowerCase()) === -1){
                devices[parts[3].toLowerCase()] = cleanup(`\`${parts[2].toLowerCase()}\`: ${parts[0]} ${parts[1]} (${parts[3]})`)
              } else {
                devices[parts[3].toLowerCase()] = cleanup(`\`${parts[2].toLowerCase()}\`: ${parts[0]} ${parts[1]} (${parts[3]})`)
              }
            }
          }
        }
      });
      globalVariables.sm = devices;
      fs.writeFileSync(__dirname+'/../sm.json', JSON.stringify(devices), function(err){if (err) throw err});
    }, 1800000)
  }

  return func;
}
