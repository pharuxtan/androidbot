module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function handleSF(link) {
    return new Promise((resolve, reject) => {
      let links = [];
      var matches;

      const request = require("request"), JSDOM = require("jsdom");

      matches = link.match(/\bhttps?:\/\/\S+/gi);

      var filteredPath = matches[0].replace("https://download.sourceforge.net", "");
      filteredPath = filteredPath.replace("https://downloads.sourceforge.net", "");
      filteredPath = filteredPath.replace("/files", "");
      filteredPath = filteredPath.replace("/projects/", "");
      filteredPath = filteredPath.replace("/project/", "");
      filteredPath = filteredPath.replace("https://sourceforge.net", "");
      filteredPath = filteredPath.replace("/download", "");

      var projectname = matches[0].split("/")[4];

      filteredPath = filteredPath.replace(projectname, "");

      var mirrorsUrl = "https://sourceforge.net/settings/mirror_choices?projectname=" + projectname + "&filename=" + filteredPath;

      request.get(mirrorsUrl, function (error, response, body) {
        var dom = new JSDOM.JSDOM(body);
        var mirrors = dom.window.document.querySelectorAll("#mirrorList li");
        for (var i = 0; i < mirrors.length; i++) {
          if (i % 2) {
            var mirrorName = mirrors[i].id;
            links.push("https://" + mirrorName + ".dl.sourceforge.net/project/" + projectname + filteredPath);
          }
        }
        resolve(links);
      });
    });
  }

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    let name = devicename(codename).split(" | ");
    if(name.filter(n => n.toLowerCase().indexOf("xiaomi") !== -1).length !== 0) name = name.filter(n => n.toLowerCase().indexOf("xiaomi") !== -1)
    let msg = await message.channel.send(`Searching stable Xiaomi.eu for \`${name.join(" | ")}\`...`);
    try {
      let devices = await fetch("https://raw.githubusercontent.com/XiaomiFirmwareUpdater/xiaomi_devices/eu/devices.json").then(res => res.json());
      if(Object.keys(devices).includes(codename)){
        let device = devices[codename][1];
        let stable = Object.keys(JSON.parse((await fetch(`https://sourceforge.net/projects/xiaomi-eu-multilang-miui-roms/files/xiaomi.eu/MIUI-STABLE-RELEASES/`).then(res => res.text())).split("net.sf.files = ")[1].split(";")[0])).sort((a,b) => parseFloat(a.toLowerCase().split("miuiv")[1])-parseFloat(b.toLowerCase().split("miuiv")[1])).reverse();
        let weekly = Object.keys(JSON.parse((await fetch(`https://sourceforge.net/projects/xiaomi-eu-multilang-miui-roms/files/xiaomi.eu/MIUI-WEEKLY-RELEASES/`).then(res => res.text())).split("net.sf.files = ")[1].split(";")[0])).sort((a,b) => parseFloat(a.toLowerCase().split(".").map(n => {if(n.length == 1){return `0${n}`}else{return n}}).join(""))-parseFloat(b.toLowerCase().split(".").map(n => {if(n.length == 1){return `0${n}`}else{return n}}).join(""))).reverse();
        let embed = new Discord.MessageEmbed()
          .setTitle(`Xiaomi.eu | ${name.join(" | ")}`);
        let found = [false,false];
        for(let version of stable){
          let files = JSON.parse((await fetch(`https://sourceforge.net/projects/xiaomi-eu-multilang-miui-roms/files/xiaomi.eu/MIUI-STABLE-RELEASES/${version}/`).then(res => res.text())).split("net.sf.files = ")[1].split(";")[0]);
          let file = Object.keys(files).filter(f => f.toLowerCase().indexOf(`${device.toLowerCase()}_`) !== -1)[0];
          if(file == undefined) continue;
          found[0] = true;
          file = files[file];
          let head = await fetch((await handleSF(file.download_url))[0], {method: "HEAD"});
          embed.addField(file.name.split("_").reverse()[1], `**Size**: \`${pretty(parseInt(head.headers.get("content-length")))}\`\n**MD5**: \`${file.md5}\`\n**SHA1**: \`${file.sha1}\`\n**Download**: [${file.name}](https://downloads.sourceforge.net/project/xiaomi-eu-multilang-miui-roms/xiaomi.eu/MIUI-STABLE-RELEASES/${version}/${file.name}?r=&ts=${Math.floor(Date.now() / 1000)}&use_mirror=autoselect)`)
          break;
        }
        if(found[0]){
          embed.setFooter('Searching for weekly version...');
          msg.edit("",{embed});
        } else msg.edit(`Searching weekly Xiaomi.eu for \`${name.join(" | ")}\`...`)
        for(let version of weekly){
          let files = JSON.parse((await fetch(`https://sourceforge.net/projects/xiaomi-eu-multilang-miui-roms/files/xiaomi.eu/MIUI-WEEKLY-RELEASES/${version}/`).then(res => res.text())).split("net.sf.files = ")[1].split(";")[0]);
          let file = Object.keys(files).filter(f => f.toLowerCase().indexOf(`${device.toLowerCase()}_`) !== -1)[0];
          if(file == undefined) continue;
          found[1] = true;
          file = files[file];
          let head = await fetch((await handleSF(file.download_url))[0], {method: "HEAD"});
          embed.addField(file.name.split("_").reverse()[1], `**Size**: \`${pretty(parseInt(head.headers.get("content-length")))}\`\n**MD5**: \`${file.md5}\`\n**SHA1**: \`${file.sha1}\`\n**Download**: [${file.name}](https://downloads.sourceforge.net/project/xiaomi-eu-multilang-miui-roms/xiaomi.eu/MIUI-WEEKLY-RELEASES/${version}/${file.name}?r=&ts=${Math.floor(Date.now() / 1000)}&use_mirror=autoselect)`)
          break;
        }
        if(found[0]) embed.footer = null;
        if(found[0] === false && found[1] === false) return msg.edit(`Xiaomi.eu wasn't find for \`${name.join(" | ")}\``);
        msg.edit("",{embed});
      } else {
        return msg.edit(`Xiaomi.eu wasn't find for \`${name.join(" | ")}\``);
      }
    } catch(e){
      console.log(e);
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["xiaomieu"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Search Xiaomi.eu for a specific device",
    "example": "{prefix}"+command.options.name[0]+" violet"
  }

  return command;
}
