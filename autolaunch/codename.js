module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  }

  function func(message){
    return setInterval(async function(){
      let devices = {};
      function add(cdn, str){
        if(devices[cdn] == undefined){
          devices[cdn] = [str];
        } else {
          if(devices[cdn].includes(str)) return;
          devices[cdn].push(str);
        }
      }
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
      let xiaomi = (await fetch("https://xiaomifirmwareupdater.com/data/names.yml").then(res => res.text()));
      const yaml = require("yaml");
      xiaomi = yaml.parse(xiaomi);
      let codenames = Object.keys(xiaomi);
      for(let i=0; i<codenames.length; i++){
        add(codenames[i], "Xiaomi "+xiaomi[codenames[i]]);
      }
      add("bacon", "OnePlus One");
      add("onyx", "OnePlus X");
      add("cheeseburger", "OnePlus 5");
      add("dumpling", "OnePlus 5T");
      add("enchilada", "OnePlus 6");
      add("fajita", "OnePlus 6T");
      add("guacamole", "OnePlus 7 Pro");
      add("guacamoleb", "OnePlus 7");
      add("hotdogb", "OnePlus 7T");
      add("hotdog", "OnePlus 7T Pro");
      add("instantnoodle", "OnePlus 8");
      add("instantnoodlep", "OnePlus 8 Pro");
      add("avicii", "OnePlus Nord");
      add("tissot", "Xiaomi Mi A1");
      add("mt2l03", "Huawei Ascend Mate 2");
      add("mt2", "Huawei Ascend Mate 2 4G");
      add("y550", "Huawei Ascend Y550");
      add("u8951", "Huawei G510");
      add("rio", "Huawei G8");
      add("cherry", "Huawei Honor 4X");
      add("che10", "Huawei Honor 4X China");
      add("nemo", "Huawei Honor 5C");
      add("kiwi", "Huawei Honor 5X");
      add("mogolia", "Huawei Honor 6");
      add("pine", "Huawei Honor 6 Plus");
      add("berlin", "Huawei Honor 6X");
      add("plank", "Huawei Honor 7");
      add("frd", "Huawei Honor 8");
      add("berkeley", "Huawei Honor View 10");
      add("blanc", "Huawei Mate 10 Pro");
      add("next", "Huawei Mate 8");
      add("carrera", "Huawei Mate S");
      add("mozart", "Huawei Mediapad M2 8.0");
      add("charlotte", "Huawei P20 Pro");
      add("grace", "Huawei P8");
      add("eva", "Huawei P9");
      add("vienna", "Huawei P9 Plus");
      add("u8815", "Huawei U8815");
      add("u8833", "Huawei Y300");
      add("cro_u00", "Huawei Y3 2017");
      add("shark", "Xiaomi Black Shark");
      add("bullhead", "Xiaomi Black Shark Helo");
      add("skywalker", "Xiaomi Black Shark 2");
      add("darklighter", "Xiaomi Black Shark 2 Pro");
      const html = await fetch("https://storage.googleapis.com/play_public/supported_devices.html").then(res => res.text());
      const fs = require('fs');
      const table = parse(html).childNodes.find(child => child.tagName == "table").childNodes.filter(child => child.nodeType !== 3).slice(1);
      let supported = [];
      table.map(tr => {tr = tr.childNodes.filter(child => child.nodeType !== 3);let device = [];tr.map(th => {try{device.push(th.childNodes[0].rawText);} catch(e) {device.push("");}});supported.push(device);});
      supported.map(parts => {
        if(parts.length === 4){
          if(cleanup(parts[1]).toLowerCase().search("chromebook") === -1){
            if(parts[0] === "Xiaomi" || parts[0] === "Redmi") return;
            if(parts[1] !== ""){
              if(cleanup(parts[1]).toLowerCase().search(cleanup(parts[0]).toLowerCase()) !== -1){
                add(parts[2].toLowerCase(), cleanup(parts[1]))
              } else {
                add(parts[2].toLowerCase(), cleanup(parts[0] + " " + parts[1]))
              }
            } else {
              if(cleanup(parts[3]).toLowerCase().search(cleanup(parts[0]).toLowerCase()) !== -1){
                add(parts[2].toLowerCase(), cleanup(parts[3]))
              } else {
                add(parts[2].toLowerCase(), cleanup(parts[0] + " " + parts[3]))
              }
            }
          }
        }
      });
      let keys = Object.keys(devices);
      for(let i in keys){
        devices[keys[i]] = uniq(devices[keys[i]]);
      }
      globalVariables.device = devices;
      fs.writeFileSync(__dirname+'/../device.json', JSON.stringify(devices), function(err){if (err) throw err});
    }, 1800000)
  }

  return func;
}
