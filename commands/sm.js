module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    try {
		  const srch = message.content.split(' ').slice(1).join(' ').trim()
      if(srch !== ""){
        var values = Object.values(sm);
  			var keys = Object.keys(sm);
  			var num = keys.map(n => n.toLowerCase()).map(n => n.indexOf(srch.toLowerCase()) !== -1);
  			var indices = [];
  			var element = true;
  			var ids = num.indexOf(element);
  			while (ids != -1) {
  				indices.push(ids);
  				ids = num.indexOf(element, ids + 1);
  			}
        var result = indices.map(n => values[n]);
        let s;
        if(result.length <= 1){
          s = "";
        } else {
          s = "s";
        }
        if(result[0] === undefined){
          message.channel.send(`No Samsung was found for model \`${srch}\``);
        } else {
          let page = 1;
          let embed = new Discord.MessageEmbed();
          let pages = result.length/10;
          pages = (Math.trunc(pages) < pages) ? Math.trunc(pages)+1 : Math.trunc(pages);
          embed.setTitle(`${result.length} result${s}${result.length < 11 ? "" : ` | 1/${pages} pages`}`);
          embed.setDescription(result.slice((page-1)*10, page*10).join("\n"));
          if(result.length < 11){
            let msg = await message.channel.send("", {embed, components: [
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
              if(message.channel.type == "dm"){
                if(user.id !== client.user.id && !user.bot && user.id === message.author.id) msg.delete();
              } else {
                if(user.id !== client.user.id && !user.bot && (user.id === message.author.id || msg.guild.members.cache.get(user.id).hasPermission("MANAGE_MESSAGES", false, true, true))) msg.delete();
              }
            });
          } else {
            let msg = await message.channel.send("",{embed, components: [
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
              if(id == 0 && user.id !== client.user.id && !user.bot && user.id === message.author.id){
                if(page-1 < 1) return;
                page--;
                let dL = page <= 1;
                let dR = page >= pages;
                let e = new Discord.MessageEmbed();
                e.setTitle(`${result.length} result${s}${result.length < 11 ? "" : ` | ${page}/${pages} pages`}`);
                e.setDescription(result.slice((page-1)*10, page*10).join("\n"));
                msg.edit("", {embed: e, components: [
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
                e.setTitle(`${result.length} result${s}${result.length < 11 ? "" : ` | ${page}/${pages} pages`}`);
                e.setDescription(result.slice((page-1)*10, page*10).join("\n"));
                msg.edit("", {embed: e, components: [
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
        }
      } else {
        message.channel.send("Please enter a samsung model !");
      }
    } catch(e){
      console.log(e);
      message.channel.send(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["sm", "smcdn"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Search a Samsung Codename with a Samsung Model",
    "example": "{prefix}sm SM-G973F"
  }

  return command;
}
