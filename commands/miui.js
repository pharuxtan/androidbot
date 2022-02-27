module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  const yaml = require("yaml");

  async function firmware(version,cdn){var firm = yaml.parse(await fetch("https://xiaomifirmwareupdater.com/data/devices/latest.yml").then(res => res.text()));var firms = firm.filter(n => `${n.downloads.osdn}`.indexOf(cdn) !== -1);return firms.find(n => n.versions.miui === version)}
  async function vendor(version,cdn){var vend = yaml.parse(await fetch("https://xiaomifirmwareupdater.com/data/vendor/latest.yml").then(res => res.text()));var vends = vend.filter(n => `${n.downloads.osdn}`.indexOf(cdn) !== -1);return vends.find(n => n.versions.miui === version)}

  async function command(message){
    let codename = cdn(message);
    if(codename == undefined) return message.channel.send("Please enter a codename !");
    if(codename == "jasmine_sprout") codename = "jasmine";
    let name = devicename(codename).split(" | ");
    if(name.filter(n => n.toLowerCase().indexOf("xiaomi") !== -1).length !== 0) name = name.filter(n => n.toLowerCase().indexOf("xiaomi") !== -1);
    let msg = await message.channel.send(`Searching MIUI for \`${name.join(" | ")}\`...`);
    try {
      let latest = yaml.parse(await fetch("https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/data/latest.yml").then(res => res.text()));
      let miuis = await getMIUI(latest, codename);
      let embed = new Discord.MessageEmbed()
        .setTitle(`MIUI | ${name.join(" | ")}`)
        .setFooter(`XiaomiFirmwareUpdater`);
      if(miuis == null) return msg.edit(`MIUI wasn't find for \`${name.join(" | ")}\``);
      for await (let a of Object.keys(miuis)){
        for await (let b of Object.keys(miuis[a])){
          let miui = miuis[a][b];
          let desc = `**MIUI Version**: \`${miui.ver}\`\n**Android Version**: \`${miui.aver}\`\n**Download**: `;
          let first = true;
          if(miui.fastboot != undefined) {desc += `${first ? "" : " | "}[fastboot](${miui.fastboot.dl}) \`${miui.fastboot.size}\``; first = false};
          if(miui.recovery != undefined) {desc += `${first ? "" : " | "}[recovery](${miui.recovery.dl}) \`${miui.recovery.size}\``; first = false};
          if(miui.vendor != undefined) {desc += `${first ? "" : " | "}[vendor](${miui.vendor.dl}) \`${miui.vendor.size}\``; first = false};
          if(miui.firmware != undefined) desc += `${first ? "" : " | "}[firmware](${miui.firmware})`;
          embed.addField(miui.name, desc);
        }
      }
      msg.edit("",{embed, components: [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "label": "Delete",
              "style": 4,
              "custom_id": "delete"
            }
          ]
        }
      ]});
      createButtonCb(msg, "delete", (interaction) => {
        client.api.interactions(interaction.id, interaction.token).callback.post({data:{type: 6}});
        let user = interaction.member ? interaction.member.user : interaction.user;
        console.log(user);
        if(message.channel.type == "dm"){
          if(user.id !== client.user.id && !user.bot && user.id === message.author.id) msg.delete();
        } else {
          if(user.id !== client.user.id && !user.bot && (user.id === message.author.id || msg.guild.members.cache.get(user.id).hasPermission("MANAGE_MESSAGES", false, true, true))) msg.delete();
        }
      });
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  async function getMIUI(latest, codename){
    let miuis = latest.filter(miui => miui.codename.split("_")[0] == codename);
    if(miuis.length == 0) return null;
    let versions = {};
    for await (let miui of miuis){
      if(versions[miui.branch] == undefined) versions[miui.branch] = [];
      let region,name;
      if(miui.codename == `${codename}_global` || miui.codename == `${codename}_sprout_global`) {region = "MI"; name = "Global"}
      else if(miui.codename == `${codename}_eea_global` || miui.codename == `${codename}_sprout_eea_global`) {region = "EU"; name = "EEA"}
      else if(miui.codename == `${codename}_in_global` || miui.codename == `${codename}_sprout_in_global`) {region = "IN"; name = "India"}
      else if(miui.codename == `${codename}_id_global` || miui.codename == `${codename}_sprout_id_global`) {region = "ID"; name = "Indonesia"}
      else if(miui.codename == `${codename}_ru_global` || miui.codename == `${codename}_sprout_ru_global`) {region = "RU"; name = "Russia"}
      else if(miui.codename == `${codename}_tr_global` || miui.codename == `${codename}_sprout_tr_global`) {region = "TR"; name = "Turkey"}
      else if(miui.codename == `${codename}_tw_global` || miui.codename == `${codename}_sprout_tw_global`) {region = "TW"; name = "Taiwan"}
      else if(miui.name.toLowerCase().endsWith(" china")) {region = "CN"; name = "China"}
      else {region = "UN"; name = "Unknown"}
      if(versions[miui.branch][region] == undefined) versions[miui.branch][region] = [];
      let json = {
        aver: miui.android,
        ver: miui.version,
        size: miui.size,
        method: miui.method,
        name: `${miui.branch} ${name}`,
        dl: miui.link
      };
      versions[miui.branch][region].push(json);
    }
    for await (let a of Object.keys(versions)){
      for await (let b of Object.keys(versions[a])){
        let miui = versions[a][b];
        let json = {
          name: miui[0].name,
          aver: miui[0].aver,
          ver: miui[0].ver,
          recovery: undefined,
          fastboot: undefined,
          firmware: await firmware(miui[0].ver,codename),
          vendor: await vendor(miui[0].ver,codename)
        };
        if(miui[0].method == "Recovery") json.recovery = {dl: miui[0].dl, size: miui[0].size};
        else json.fastboot = {dl: miui[0].dl, size: miui[0].size};
        if(miui[1] != undefined){
          if(miui[1].method == "Recovery") json.recovery = {dl: miui[1].dl, size: miui[1].size};
          else json.fastboot = {dl: miui[1].dl, size: miui[1].size};
        }
        if(json.firmware != undefined) json.firmware = json.firmware.downloads.github;
        if(json.vendor != undefined) json.vendor = {dl: json.vendor.downloads.github, size: json.vendor.size};
        versions[a][b] = json;
      }
    }
    return versions;
  }

  command.options = {
    name: ["miui", "latestmiui"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Search Official MIUI for a specific device (sources: [XiaomiFirmwareUpdater](https://xiaomifirmwareupdater.com/))",
    "example": "{prefix}miui violet"
  }

  return command;
}
