module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  const Entities = require('html-entities').AllHtmlEntities;
  const entities = new Entities();
  const gplay = require('google-play-scraper');

  async function command(message){
    try {
			let srch = message.content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ").slice(1).join(" ");
      if(srch !== ""){
        gplay.app({appId: srch, lang: "en"}).then(async (json) => {
          var e = new Discord.MessageEmbed()
            .setTitle(json.title).setURL(json.url).setThumbnail(json.icon)
            .setDescription(entities.decode(json.summary))
            .addField("Price", json.priceText, true)
            .addField("Installs", json.installs, true)
            .addField("Android version", json.androidVersionText, true)
            .addField("Size", json.size, true)
            .addField("Score", json.scoreText, true)
            .addField("Genre", json.genre, true)
            .setFooter(`By ${json.developer} | ${json.appId}`)
          message.channel.send(e)
        }).catch(err => {
          gplay.search({term: srch, num: 20, lang: "en"}).then(m => {
            var id = FuzzySearch(m.map(n => n.title), srch).map(n => { return m[n].appId});
						gplay.app({appId: id[0], lang: "en"}).then(async (json) => {
              var e = new Discord.MessageEmbed()
                .setTitle(json.title).setURL(json.url).setThumbnail(json.icon)
                .setDescription(entities.decode(json.summary))
                .addField("Price", json.priceText, true)
                .addField("Installs", json.installs, true)
                .addField("Android version", json.androidVersionText, true)
                .addField("Size", json.size, true)
                .addField("Score", json.scoreText, true)
                .addField("Genre", json.genre, true)
                .setFooter(`By ${json.developer} | ${json.appId}`)
              message.channel.send(e)
						}).catch(err => {
  						message.channel.send(`No app was found for \`${srch}\``);
					  });
					}).catch(err => {
						message.channel.send(`No app was found for \`${srch}\``);
					});
        });
      } else {
        message.channel.send("Please enter an app ID or an app name !");
      }
    } catch(e){
      message.channel.send(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["gplay"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Search Google Play application with a app ID or app name (sources: [GSM Arena](http://gsmarena.com/))",
    "example": "{prefix}gplay com.google.android.youtube\n{prefix}gplay Youtube"
  }

  return command;
}
