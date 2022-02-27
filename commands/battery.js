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

  function uniq(values) {
    let unique = {};
    values.forEach(function(i) {
      if(!unique[i]) {
        unique[i] = true;
      }
    });
    return Object.keys(unique);
  }

  let numbers = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"]

  const Entities = require('html-entities').AllHtmlEntities;
  const entities = new Entities();

  String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
  }

  async function command(message){
    let msg = undefined;
    try {
      let srch = message.content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ").slice(1).join(" ");
      if(srch !== ""){
        msg = await message.channel.send(`Searching battery test for \`${srch}\`...`)
        let result = await search(srch);
        if(result === "rate") return msg.edit(`An error occured, please retry later. (Too Many Requests)`);
        if(result === false) return msg.edit(`No battery test was found for \`${srch}\``);
        for(let i in result){
          let r = result[i];
          let root = require("node-html-parser").parse(await fetch(proxy+r.url, opts).then(res => res.text())).querySelector(".help-review");
          if(root !== null){
            let review = await fetch(proxy+"https://www.gsmarena.com/"+root.childNodes[0].rawAttrs.split('href="')[1].split('"')[0].replace(".php", "p3.php"), opts).then(res => res.text());
            let imgs = [];
            if(review.indexOf("battery-test.php3?") !== -1){
              let j = 0;
              while(true){
                let img = review.substr(review.indexOf("battery-test.php3?")).split('"')[j];
                if(img == undefined) break;
                if(img.indexOf("/battery/") !== -1) imgs.push(img);
                j += 2;
              }
              imgs = uniq(imgs);
            } else {
              imgs = uniq(review.match(/https?:\/\/[^\/\s]+\/\S+\.(jpg)/g).filter(c => c.indexOf("/battery/") !== -1));
            }
            if(imgs.length == 0) result[i] = null;
            else if(imgs.length == 1) result[i] = {"url":"https://www.gsmarena.com/"+review.substr(review.indexOf("battery-test.php3?")).split('"')[0],"name": result[i].name,"img":imgs[0]};
            else {
              let hzs = [];
              for(let img of imgs){
                let name = img.split("/").slice(-1)[0].replace(/-/g, "_");
                if(name.indexOf("hz") == -1){
                  if(name.split("_").slice(-1)[0].length <= 3){
                    result[i] = {"url":"https://www.gsmarena.com/"+review.substr(review.indexOf("battery-test.php3?")).split('"')[0],"name": result[i].name,"img":img};
                  } else {
                    let hz = name.split("_").slice(-1)[0].slice(3).split(".")[0];
                    hzs.push({hz, img});
                  }
                } else {
                  let hz = name.split("_").slice(-1)[0].split("hz")[0];
                  hzs.push({hz, img});
                }
              }
              for(let img of hzs){
                let link = review.substr(review.indexOf("battery-test.php3?")).split('"')[0];
                if(link == "\n") link = result[i].url.replace("https://www.gsmarena.com/", "");
                let hz = img.hz;
                if(!(["30", "60", "120", "144", "240"].includes(hz))) hz = "unknown ";
                result.push({"url":"https://www.gsmarena.com/"+link,"name": `${result[i].name} (${hz}Hz)`,"img":img.img});
              }
            }
          } else {
            result[i] = null;
          }
        }
        result = result.filter(r => {
          if(r == null) return false;
          if(r.img.indexOf("/battery/") == -1) return false;
          return true;
        });
        if(result.length === 0) return msg.edit(`No battery test was found for \`${srch}\``);
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
            msg.edit("",{embed, components: [
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
            let phones = result;
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
                    "custom_id": components[i].custom_id
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
  				const embed = new Discord.MessageEmbed()
  					.setTitle(name)
  					.setURL(url)
            .setDescription("If the image don't appear [click here]("+img+")")
  					.setImage(img)
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
      if(msg !== undefined){
        msg.edit(`An error occured, please retry later.`);
      } else {
        message.channel.send(`An error occured, please retry later.`);
      }
    }
  }

  command.options = {
    name: ["battery"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Search battery test for a specific device (sources: [GSM Arena](http://gsmarena.com/))",
    "example": "{prefix}battery realme 6i"
  }

  return command;
}
