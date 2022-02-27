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
    let msg = await message.channel.send(`Searching official BootleggersROM for \`${devicename(codename)}\`...`);
    try {
      let codenames = Object.keys(JSON.parse((await fetch("https://sourceforge.net/projects/bootleggersrom/files/builds/").then(res => res.text())).split("net.sf.files = ")[1].split(";")[0]));
      if(!codenames.includes(codename)){
        if(codenames.includes(codename.toUpperCase())) codename = codename.toUpperCase();
      }
      if(codenames.includes(codename)){
        let file = JSON.parse((await fetch(`https://sourceforge.net/projects/bootleggersrom/files/builds/${codename}/`).then(res => res.text())).split("net.sf.files = ")[1].split(";")[0]);
        let files = Object.keys(file).filter(f => f.endsWith(".zip")).sort((a,b) => (parseFloat(b.split("-")[4])-parseFloat(a.split("-")[4])));
        if(files.length == 0) return msg.edit(`BootleggersROM wasn't find for \`${devicename(codename)}\``);
        let official = files[0];
        if(official == undefined) return msg.edit(`BootleggersROM wasn't find for \`${devicename(codename)}\``);
        let head = await fetch((await handleSF(file[official].download_url))[0], {method: "HEAD"});
        let embed = new Discord.MessageEmbed()
          .setTitle(`BootleggersROM | ${devicename(codename).split(" | ")[0]}`)
          .setDescription(`**Version**: \`${official.split("-")[1]}\`\n**Date**: \`${official.split("-")[4].substring(0,4)}-${official.split("-")[4].substring(4,6)}-${official.split("-")[4].substring(6,8)}\`\n**Size**: \`${pretty(parseInt(head.headers.get("content-length")))}\`\n**MD5**: \`${file[official].md5}\`\n**SHA1**: \`${file[official].sha1}\`\n**Download**: [${official}](https://downloads.sourceforge.net/project/bootleggersrom/builds/${codename}/${official}?r=&ts=${Math.floor(Date.now() / 1000)}&use_mirror=autoselect)`);
        msg.edit("",{embed});
      } else {
        msg.edit(`BootleggersROM wasn't find for \`${devicename(codename)}\``);
      }
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
      console.log(e);
    }
  }

  command.options = {
    name: ["btlg", "bootleggers"],
    enable: true
  };

  command.romname = "BootleggersROM"

  command.help = {
    "category": "roms",
    "description": "Get Official "+command.romname+" for a specific device",
    "example": "{prefix}"+command.options.name[0]+" violet"
  }

  command.roms = async function(codename){
    try {
      let codenames = Object.keys(JSON.parse((await fetch("https://sourceforge.net/projects/bootleggersrom/files/builds/").then(res => res.text())).split("net.sf.files = ")[1].split(";")[0]));
      if(!codenames.includes(codename)){
        if(codenames.includes(codename.toUpperCase())) codename = codename.toUpperCase();
      }
      if(codenames.includes(codename)){
        let file = JSON.parse((await fetch(`https://sourceforge.net/projects/bootleggersrom/files/builds/${codename}/`).then(res => res.text())).split("net.sf.files = ")[1].split(";")[0]);
        let files = Object.keys(file).filter(f => f.endsWith(".zip") && f.split("-").length > 5).sort((a,b) => (parseFloat(b.split("-")[4])-parseFloat(a.split("-")[4])));
        if(files.length == 0) return null;
        let official = files[0];
        if(official == undefined) return null;
        return `${command.romname} (${command.options.name.join("/")})`
      } else {
        return null;
      }
    } catch(e){
      return null;
    }
  }

  return command;
}
