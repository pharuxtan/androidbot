module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  //preload commands
  if(fs.existsSync(__dirname+"/commands")){
    let commands = getFiles(__dirname+"/commands").filter(f => f.endsWith(".js"));
    for(let i=0; i<commands.length; i++) require(commands[i]);
  }

  client.ws.on('INTERACTION_CREATE', async interaction => {
    if(interaction.type != 2) return;
    let slash = await new SlashAPI().init(interaction);
    let commands = getFiles(__dirname+"/commands").filter(f => f.endsWith(".js"));
    for(let i=0; i<commands.length; i++){
      let command = require(commands[i])(globalVariables);
      for(let n=0; n<command.options.name.length; n++){
        if(slash.content.toLowerCase().startsWith(command.options.name[n].toLowerCase()) && command.options.enable) return command(slash);
      }
    }
  });

  class SlashAPI {
    async init(interaction){
      this.slash = true;
      this.interaction = interaction;
      this.command = interaction.data.name;
      this.options = interaction.data.options;
      if(interaction.user){ // dm
        this.dm = true;
        this.channel = await client.channels.fetch(interaction.channel_id);
        this.author = await client.users.fetch(interaction.user.id);
        this.bot_scope = true;
      } else { // guild
        this.dm = false;
        if(client.guilds.cache.get(interaction.guild_id)){
          this.bot_scope = true;
          this.guild = client.guilds.cache.get(interaction.guild_id);
          this.channel = this.guild.channels.cache.get(interaction.channel_id);
          this.member = await this.guild.members.fetch(interaction.member.user.id);
          this.author = this.member.user;
        } else this.bot_scope = false;
      }
      let content = this.command;
      function fetchOptions(options){
        for(let option of options){
          if(option.value) content += ` ${option.value}`;
          else content += ` ${option.name}`;
          if(option.options) fetchOptions(option.options);
        }
      }
      if(interaction.data.options) fetchOptions(interaction.data.options);
      this.content = content;
      return this;
    }

    async callMessageEvent(){
      if(this.bot_scope){
        let send = this.channel.send;
        let self = this;
        this.channel.send = async (...args) => {
          let msg = await self.send(...args);
          this.channel.send = send;
          return msg;
        }
        client.emit("message", this);
      }
    }

    parseMessage(content = "\u200B", embeds = [], allowed_mentions = {}, tts = false){
      let data = {content,embeds,allowed_mentions,tts};
      if(embeds instanceof Discord.MessageEmbed){
        data.embeds = [embeds];
      } if(content instanceof Discord.MessageEmbed){
        if(Array.isArray(data.embeds)) data.embeds.push(content);
        else data.embeds = [content];
        data.content = "\u200B";
      } if(typeof content == "object"){
        if(content.tts) data.tts = content.tts
        if(content.allowed_mentions) data.allowed_mentions = content.allowed_mentions
        if(content.embeds) data.embeds = content.embeds
        if(content.embed){
          if(Array.isArray(data.embeds)) data.embeds.push(content.embed);
          else data.embeds = [content.embed];
        }
        if(content.content) data.content = content.content
        else data.content = "\u200B";
      } else if(typeof embeds == "object"){
        if(embeds.tts) data.tts = embeds.tts
        if(embeds.allowed_mentions) data.allowed_mentions = embeds.allowed_mentions
        if(embeds.embeds) data.embeds = embeds.embeds
        else data.embeds = [];
        if(embeds.embed){
          if(Array.isArray(data.embeds)) data.embeds.push(embeds.embed);
          else data.embeds = [embeds.embed];
        }
      } if(data.embeds instanceof Discord.MessageEmbed){
        data.embeds = [data.embeds];
      } if(data.content instanceof Discord.MessageEmbed){
        if(Array.isArray(data.embeds)) data.embeds.push(data.content);
        else data.embeds = [data.content];
        data.content = "\u200B";
      }
      if(data.content == "") data.content = "\u200B";
      return data;
    }

    async send(...args){
      let d = this.parseMessage(...args);
      await client.api.interactions(this.interaction.id, this.interaction.token).callback.post({data: {
        type: 4,
        data: d
      }});
      let {parseMessage, interaction} = this;
      let self = this;
      async function createMessage(msg){
        if(self.bot_scope) msg = new Discord.Message(client, msg, self.channel);
        Object.assign(msg, {
          edit(...args){
            let data = parseMessage(...args);
            client.api.webhooks(client.user.id, interaction.token).messages[msg.id].patch({data});
          },
          delete(options){
            if(options.timeout){
              setTimeout(() => {
                client.api.webhooks(client.user.id, interaction.token).messages[msg.id].delete();
              }, options.timeout);
            } else {
              client.api.webhooks(client.user.id, interaction.token).messages[msg.id].delete();
            }
          }
        });
        return msg;
      }
      let msg = await client.api.webhooks(client.user.id, interaction.token).messages["@original"].get();
      msg = await createMessage(msg);
      msg.followup = async function followup(...args){
        let data = parseMessage(...args);
        let m = await client.api.webhooks(client.user.id, interaction.token).post({data});
        return await createMessage(m);
      }
      return msg;
    }
  }
}
