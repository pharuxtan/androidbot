module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  let opts = {headers: {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36 Edg/92.0.902.62"}};

  let proxy = ""//"http://161.97.86.32:4699/";

  async function search(a) {
    try {
      let text = await fetch(`${proxy}https://www.gsmarena.com/res.php3?sSearch=${a}`, opts).then(res => res.text());
      if(text.indexOf("Too Many Requests") != -1) return "rate";
      if (require("node-html-parser").parse(text).querySelector(".makers") === null) return false;
      return require("node-html-parser").parse(text).querySelector(".makers").childNodes.find(n => n.tagName == "ul").childNodes.filter(n => n.nodeType !== 3).map(n => {
        var url = `https://www.gsmarena.com/${n.childNodes[0].rawAttrs.split('"')[1]}`;
        var img = `${n.childNodes[0].childNodes[0].rawAttrs}`.split('=')[1].split(" ")[0];
        var name = n.childNodes[0].childNodes[1].childNodes[0].childNodes.filter(n => n.tagName !== "br").map(n => n.rawText).join(" ");
        return {
          url,
          img,
          name
        }
      })
    } catch (e) {
      return false
    }
  }

  let numbers = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"]

  const Entities = require('html-entities').AllHtmlEntities;
  const entities = new Entities();

  async function command(message){
    let msg = undefined
    try {
		  let srch = message.content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ").slice(1).join(" ");
      if(srch !== ""){
        msg = await message.channel.send(`Searching specifications for \`${srch}\`...`)
        let result = await search(srch);
        if(result === "rate") return msg.edit(`An error occured, please retry later. (Too Many Requests)`);
        if(result === false) return msg.edit(`No specifications was found for \`${srch}\``);
        let spec = false;
        if(result.length !== 1){
          let page = 1;
          let embed = new Discord.MessageEmbed();
          let pages = result.length/5;
          pages = (Math.trunc(pages) < pages) ? Math.trunc(pages)+1 : Math.trunc(pages);
          embed.setTitle(`${result.length} results${result.length < 6 ? "" : ` | 1/${pages} pages`}`);
          embed.setFooter("GSM Arena");
          if(result.length < 6){
            let desc = "**";
            let components = [];
            for(let i in result){
              components.push({
                "type": 2,
                "label": String(Number(i)+1),
                "style": 1,
                "custom_id": String(Number(i)+1)
              });
              desc += `${numbers[parseInt(i)+1]} : ${result[i].name}\n`
            }
            desc += "**";
            embed.setDescription(desc);
            await msg.edit("",{embed, components: [
              {
                "type": 1,
                components
              },
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
            for(let i in components){
              createButtonCb(msg, components[i].custom_id, (interaction) => {
                client.api.interactions(interaction.id, interaction.token).callback.post({data:{type: 6}});
                let user = interaction.member ? interaction.member.user : interaction.user;
                if(user.id !== client.user.id && !user.bot && user.id === message.author.id){
                  specs(result[i],msg);
                }
              });
            }
            createButtonCb(msg, "delete", (interaction) => {
              client.api.interactions(interaction.id, interaction.token).callback.post({data:{type: 6}});
              let user = interaction.member ? interaction.member.user : interaction.user;
              if(message.channel.type == "dm"){
                if(user.id !== client.user.id && !user.bot && user.id === message.author.id) msg.delete();
              } else {
                if(user.id !== client.user.id && !user.bot && (user.id === message.author.id || msg.guild.members.cache.get(user.id).hasPermission("MANAGE_MESSAGES", false, true, true))) msg.delete();
              }
            });
          } else {
            let desc = "**";
            let components = [];
            for(let i in result.slice((page-1)*5, page*5)){
              components.push({
                "type": 2,
                "label": String(Number(i)+1),
                "style": 1,
                "custom_id": String(Number(i)+1)
              });
              desc += `${numbers[parseInt(i)+1]} : ${result.slice((page-1)*5, page*5)[i].name}\n`
            }
            desc += "**";
            embed.setDescription(desc);
            let phones = result
            await msg.edit("",{embed, components: [
              {
                "type": 1,
                components
              },
              {
                "type": 1,
                "components": [
                  {
                    "type": 2,
                    "emoji": {
                      "id": "835460270519746570",
                      "name": "leftarrow"
                    },
                    "style": 1,
                    "custom_id": "left",
                    "disabled": true
                  },
                  {
                    "type": 2,
                    "emoji": {
                      "id": "835460181882175488",
                      "name": "rightarrow"
                    },
                    "style": 1,
                    "custom_id": "right"
                  },
                  {
                    "type": 2,
                    "label": "Delete",
                    "style": 4,
                    "custom_id": "delete"
                  }
                ]
              }
            ]});
            for(let i in components){
              createButtonCb(msg, components[i].custom_id, (interaction) => {
                client.api.interactions(interaction.id, interaction.token).callback.post({data:{type: 6}});
                let user = interaction.member ? interaction.member.user : interaction.user;
                if(user.id !== client.user.id && !user.bot && user.id === message.author.id){
                  specs(result.slice((page-1)*5, page*5)[i],msg)
                }
              });
            }
            createButtonCb(msg, "delete", (interaction) => {
              client.api.interactions(interaction.id, interaction.token).callback.post({data:{type: 6}});
              let user = interaction.member ? interaction.member.user : interaction.user;
              if(message.channel.type == "dm"){
                if(user.id !== client.user.id && !user.bot && user.id === message.author.id) msg.delete();
              } else {
                if(user.id !== client.user.id && !user.bot && (user.id === message.author.id || msg.guild.members.cache.get(user.id).hasPermission("MANAGE_MESSAGES", false, true, true))) msg.delete();
              }
            });
            createButtonCb(msg, "left", (interaction) => {
              client.api.interactions(interaction.id, interaction.token).callback.post({data:{type: 6}});
              let user = interaction.member ? interaction.member.user : interaction.user;
              react(0, user);
            })();
            createButtonCb(msg, "right", (interaction) => {
              client.api.interactions(interaction.id, interaction.token).callback.post({data:{type: 6}});
              let user = interaction.member ? interaction.member.user : interaction.user;
              react(1, user);
            })();
            function react(id, user){
              if(spec) return;
              if(id == 0 && user.id !== client.user.id && !user.bot && user.id === message.author.id){
                if(page-1 < 1) return;
                page--;
                let dL = page <= 1;
                let dR = page >= pages;
                let e = new Discord.MessageEmbed();
                e.setTitle(`${result.length} results${result.length < 6 ? "" : ` | ${page}/${pages} pages`}`);
                e.setFooter("GSM Arena");
                let d = "**";
                let co = [];
                for(let i in result.slice((page-1)*5, page*5)){
                  co.push({
                    "type": 2,
                    "label": String(Number(i)+1),
                    "style": 1,
                    "custom_id": String(Number(i)+1)
                  });
                  d += `${numbers[parseInt(i)+1]} : ${result.slice((page-1)*5, page*5)[i].name}\n`
                }
                d += "**";
                e.setDescription(d);
                msg.edit("", {embed: e, components: [
                  {
                    "type": 1,
                    "components": co
                  },
                  {
                    "type": 1,
                    "components": [
                      {
                        "type": 2,
                        "emoji": {
                          "id": "835460270519746570",
                          "name": "leftarrow"
                        },
                        "style": 1,
                        "custom_id": "left",
                        "disabled": dL
                      },
                      {
                        "type": 2,
                        "emoji": {
                          "id": "835460181882175488",
                          "name": "rightarrow"
                        },
                        "style": 1,
                        "custom_id": "right",
                        "disabled": dR
                      },
                      {
                        "type": 2,
                        "label": "Delete",
                        "style": 4,
                        "custom_id": "delete"
                      }
                    ]
                  }
                ]});
              } else if(id == 1 && user.id !== client.user.id && !user.bot && user.id === message.author.id){
                if(page+1 > pages) return;
                page++;
                let dL = page <= 1;
                let dR = page >= pages;
                let e = new Discord.MessageEmbed();
                e.setTitle(`${result.length} results${result.length < 6 ? "" : ` | ${page}/${pages} pages`}`);
                e.setFooter("GSM Arena");
                let d = "**";
                let co = [];
                for(let i in result.slice((page-1)*5, page*5)){
                  co.push({
                    "type": 2,
                    "label": String(Number(i)+1),
                    "style": 1,
                    "custom_id": String(Number(i)+1)
                  });
                  d += `${numbers[parseInt(i)+1]} : ${result.slice((page-1)*5, page*5)[i].name}\n`
                }
                d += "**";
                e.setDescription(d);
                msg.edit("", {embed: e, components: [
                  {
                    "type": 1,
                    "components": co
                  },
                  {
                    "type": 1,
                    "components": [
                      {
                        "type": 2,
                        "emoji": {
                          "id": "835460270519746570",
                          "name": "leftarrow"
                        },
                        "style": 1,
                        "custom_id": "left",
                        "disabled": dL
                      },
                      {
                        "type": 2,
                        "emoji": {
                          "id": "835460181882175488",
                          "name": "rightarrow"
                        },
                        "style": 1,
                        "custom_id": "right",
                        "disabled": dR
                      },
                      {
                        "type": 2,
                        "label": "Delete",
                        "style": 4,
                        "custom_id": "delete"
                      }
                    ]
                  }
                ]});
              }
            }
          }
        } else {
          specs(result[0]);
          createButtonCb(msg, "delete", (interaction) => {
            client.api.interactions(interaction.id, interaction.token).callback.post({data:{type: 6}});
            let user = interaction.member ? interaction.member.user : interaction.user;
            if(message.channel.type == "dm"){
              if(user.id !== client.user.id && !user.bot && user.id === message.author.id) msg.delete();
            } else {
              if(user.id !== client.user.id && !user.bot && (user.id === message.author.id || msg.guild.members.cache.get(user.id).hasPermission("MANAGE_MESSAGES", false, true, true))) msg.delete();
            }
          });
        }
        async function specs(phone){
          if(spec) return;
          let {url,img,name} = phone;
          spec = true;
          var body = await fetch(proxy+url, opts).then(n => n.text());
    		  var specs = require("node-html-parser").parse(body).querySelector("#specs-list").childNodes.filter(n => n.tagName == "table");
    		  function tab(a){try{return specs.find(b => b.childNodes.filter(c => c.nodeType !== 3)[0].childNodes.filter(c => c.nodeType !== 3)[0].childNodes[0].rawText.toLowerCase() == a.toLowerCase()).childNodes.filter(b => b.nodeType !== 3).map(b => b.childNodes.filter(a => a.nodeType !== 3).filter(a => `${a.rawAttrs}`.indexOf("rowspan") === -1).map(a => {if(`${a.rawAttrs}`.indexOf("ttl") !== -1){try {return a.childNodes[0].childNodes[0].rawText} catch(e){return false}} else {if(a.childNodes[1] !== undefined){return a.childNodes.filter(n => n.tagName !== "br").map(n => n.rawText.replace("\r\n", ""));} else {return a.childNodes[0].rawText}}})).map(n => n.filter(d => d)).filter(d => d[0] !== undefined)}catch(e){return false}}
    			var table = {"NETWORK": tab("NETWORK"),"LAUNCH": tab("LAUNCH"),"BODY": tab("BODY"),"DISPLAY": tab("DISPLAY"),"PLATFORM": tab("PLATFORM"),"MEMORY": tab("MEMORY"),"MAIN CAMERA": tab("MAIN CAMERA"),"SELFIE CAMERA": tab("SELFIE CAMERA"),"SOUND": tab("SOUND"),"COMMS": tab("COMMS"),"FEATURES": tab("FEATURES"),"BATTERY": tab("BATTERY"),"MISC": tab("MISC"),"TESTS": tab("TESTS")};
    			function find(a, c){if(c !== undefined){try{var b = a.split("/")[0];return (typeof table[b][c][1] !== "object") ? table[b][c][1] : "\n"+table[b][c][1].join("\n")}catch(e){return false}}else{try{var b = a.split("/")[0];a = a.split("/")[1];var find = (table[b].find(n => n[0] == a) !== undefined) ? table[b].find(n => n[0] == a).slice(1) : false;if(find){return (find.length == 1) ? find[0] : find.join(" | ")}else{return false}}catch(e){return false}}};
    			function findone(a, c){if(c !== undefined){try{var b = a.split("/")[0];return (typeof table[b][c][0] !== "object") ? table[b][c][0] : "\n"+table[b][c][0].join("\n")}catch(e){return false}}else{try{var b = a.split("/")[0];a = a.split("/")[1];var find = (table[b].find(n => n[0] == a) !== undefined) ? table[b].find(n => n[0] == a) : false;if(find){return (find.length == 1) ? find[0] : find.join(" | ")}else{return false}}catch(e){return false}}};
     		  function findname(a, c){if(c !== undefined){try{var b = a.split("/")[0];return table[b][c][0]}catch(e){return false}}else{try{return a.split("/")[1]}catch(e){return false}}};
    		  var status = [findname("LAUNCH/Status"),find("LAUNCH/Status")]
          var network = [findname("NETWORK/Technology"),find("NETWORK/Technology")]
    		  var dimensions = [findname("BODY/Dimensions"),find("BODY/Dimensions")]
    		  var weight = [findname("BODY/Weight"),find("BODY/Weight")]
    		  var build = [findname("BODY/Build"),find("BODY/Build")]
    		  var type = [findname("DISPLAY/Type"),find("DISPLAY/Type")]
    		  var size = [findname("DISPLAY/Size"),find("DISPLAY/Size")]
    		  var resolution = [findname("DISPLAY/Resolution"),find("DISPLAY/Resolution")]
    		  var os = [findname("PLATFORM/OS"),find("PLATFORM/OS")]
    		  var chipset = [findname("PLATFORM/Chipset"),find("PLATFORM/Chipset")]
    		  var cardslot = [findname("MEMORY/Card slot"),find("MEMORY/Card slot")]
    		  var internal = [findname("MEMORY/Internal"),find("MEMORY/Internal")]
    			var colors = [findname("MISC/Colors"),find("MISC/Colors")]
          var maincam = [findname("MAIN CAMERA", 0),find("MAIN CAMERA", 0)]
          var display = [findname("DISPLAY", 4),find("DISPLAY", 4)]
    		  var selfiecam = [findname("SELFIE CAMERA", 0),find("SELFIE CAMERA", 0)]
    			var battery = [findname("BATTERY/Type"),find("BATTERY/Type")]
          //var price = [findname("MISC/Price"),find("MISC/Price")]
          var bluetooth = [findname("COMMS/Bluetooth"),find("COMMS/Bluetooth")]
          var usb = [findname("COMMS/USB"),find("COMMS/USB")]

    		  var desc = "";
    		  if(status[1]){desc += `\n**${status[0]}**: ${status[1]}`}
    		  if(network[1]){desc += `\n**Network**: ${network[1]}`}
    		  if(dimensions[1]){desc += `\n**${dimensions[0]}**: ${dimensions[1]}`}
    		  if(weight[1]){desc += `\n**${weight[0]}**: ${weight[1]}`}
    		  if(build[1]){desc += `\n**${build[0]}**: ${build[1]}`}
    		  if(type[1]){desc += `\n**${type[0]}**: ${type[1]}`}
    		  if(size[1]){desc += `\n**${size[0]}**: ${size[1]}`}
          if(resolution[1]){desc += `\n**${resolution[0]}**: ${resolution[1]}`}
          if(display[0]){
            if(typeof desplay === "object"){
              desc += `\n**Display**: \n${display[0].join("\n")}`
            } else {
              desc += `\n**Display**: ${display[0]}`
            }
          }
    		  if(os[1]){desc += `\n**${os[0]}**: ${os[1]}`}
    		  if(chipset[1]){desc += `\n**${chipset[0]}**: ${chipset[1]}`}
    		  if(cardslot[1]){desc += `\n**${cardslot[0]}**: ${cardslot[1]}`}
    		  if(internal[1]){desc += `\n**${internal[0]}**: ${internal[1]}`}
    		  if(maincam[1]){desc += `\n**Main Camera**: ${maincam[1].replace(/�/g, "µ")}`}
    		  if(selfiecam[1]){desc += `\n**Selfie Camera**: ${selfiecam[1].replace(/�/g, "µ")}`}
    		  if(bluetooth[1]){desc += `\n**${bluetooth[0]}**: ${bluetooth[1]}`}
    		  if(usb[1]){desc += `\n**${usb[0]}**: ${usb[1]}`}
    		  if(battery[1]){desc += `\n**Battery**: ${battery[1]}`}
    			if(colors[1]){desc += `\n**${colors[0]}**: ${colors[1]}`}
    			//if(price[1]){desc += `\n**${price[0]}**: ${price[1]}`}
    			desc = entities.decode(desc);

  				const embed = new Discord.MessageEmbed()
  					.setTitle(name)
  					.setURL(url)
  					.setDescription(desc)
  					.setThumbnail(img)
  					.setFooter(`GSM Arena`)
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
        }
      } else {
        message.channel.send("Please enter a phone name !")
      }
    } catch(e){
      console.log(e);
      if(msg){
        msg.edit(`An error occured, please retry later.`);
      } else {
        message.channel.send(`An error occured, please retry later.`);
      }
    }
  }

  command.options = {
    name: ["gsm","specs"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Search specifications for a specific device (sources: [GSM Arena](http://gsmarena.com/))",
    "example": "{prefix}gsm Xiaomi Redmi Note 7 Pro"
  }

  return command;
}
