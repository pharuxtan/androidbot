module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  const android = require("android-versions");

  function name(name){
    if(name === "(no code name)" || name.toLowerCase().startsWith("android")){
      return "";
    } else {
      return name;
    }
  }

  function color(name){
    if(name === "Pie"){
      return 0xe0f6d9
    } else if(name === "Oreo"){
      return 0xedb405
    } else if(name === "Nougat"){
      return 0x4fc3f6
    } else if(name === "Marshmallow"){
      return 0xe91e63
    } else if(name === "Lollipop"){
      return 0x9c27b1
    } else if(name === "KitKat" || name === "KitKat Watch"){
      return 0x693c20
    } else if(name === "Jellybean"){
      return 0xfe0000
    } else if(name === "Ice Cream Sandwich"){
      return 0x8a4e1d
    } else if(name === "Honeycomb"){
      return 0x00467a
    } else if(name === "Gingerbread"){
      return 0xb28a70
    } else if(name === "Froyo"){
      return 0xa4d229
    } else if(name === "Eclair"){
      return 0xc19d53
    } else if(name === "Donut"){
      return 0xf4f5f7
    } else if(name === "Cupcake"){
      return 0x8cc63c
    } else if(name === "Android10") {
      return 0x77c35f
    } else if(name === "Android11") {
      return 0x70d68d
    } else {
      return 0xffffff
    }
  }

  async function command(message){
    try {
      let version = message.content.split(" ")[1];
      if(version != undefined){
        let ver = (version === "11.0.0" || version === "11.0" || version === "30") ? { api: 30, ndk: 8, semver: "11", name: "Android11", versionCode: "R" } : android.get(version);
        if(ver == null) return message.channel.send("Please enter a correct android or api version");
        let embed = new Discord.MessageEmbed()
          .setTitle(`Android ${ver.semver} ${name(ver.name)}`)
          .setColor(color(ver.name))
          .setDescription(`**API**: \`${ver.api}\`\n**NDK**: \`${ver.ndk}\`\n**Version Code**: \`${ver.versionCode}\``);
        message.channel.send(embed);
      } else {
        message.channel.send("Please enter an android version");
      }
    } catch(e){
      message.channel.send(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["android"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Search android version",
    "example": "{prefix}android 29\n{prefix}android 10.0"
  }

  return command;
}
