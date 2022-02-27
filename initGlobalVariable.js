const Discord = require("discord.js");

module.exports = (globalVariables) => {
  if(!globalVariables.Discord) globalVariables.Discord = require("discord.js");
  if(!globalVariables.client) globalVariables.client = globalVariables.bot = new globalVariables.Discord.Client({disableMentions:"everyone"});
  if(!globalVariables.fs) globalVariables.fs = require("fs");
  if(!globalVariables.getFiles) globalVariables.getFiles = (dir, files_) => {
    files_ = files_ || [];
    if(globalVariables.fs.existsSync(dir)) {
      var files = globalVariables.fs.readdirSync(dir);
      for(var i in files) {
        var name = dir + '/' + files[i];
        if(globalVariables.fs.statSync(name).isDirectory()) {
          globalVariables.getFiles(name, files_);
        } else {
          files_.push(name);
        }
      }
    }
    return files_;
  }
  if(!globalVariables.guild) globalVariables.guild = require("./guild.json");
  if(!globalVariables.cdn) globalVariables.cdn = (message) => {
    var coden = message.content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(' ')[1];
    if(coden !== undefined){
      var change = require("./changecdn.json");
      for(var i=0; i<change.length; i++){
        var val = change[i]
        if(coden === val[0]){
          coden = coden.replace(val[0], val[1]);
        }
      }
    }
    return coden;
  }
  if(!globalVariables.device) globalVariables.device = require('./device.json');
  if(!globalVariables.sm) globalVariables.sm = require('./sm.json');
  if(!globalVariables.fetch) globalVariables.fetch = require("node-fetch");
  if(!globalVariables.pretty) globalVariables.pretty = require('prettysize');
  if(!globalVariables.timeconv) globalVariables.timeconv = (timestamp) => {
    var a = new Date(timestamp * 1000);
    var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    var dates = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = dates[a.getDate()-1];
    var time = `${year}-${month}-${date}`;
    return time;
  }
  if(!globalVariables.FuzzySearch) globalVariables.FuzzySearch = require('./fuzzy.js');
  if(!globalVariables.fapp) globalVariables.fapp = require('firebase').initializeApp({apiKey: "AIzaSyAjfPSshzXoje3pewbnfpJYhlRrbNRmFEU",authDomain: "twrpbuilder.firebaseapp.com",databaseURL: "https://twrpbuilder.firebaseio.com",projectId: "twrpbuilder",storageBucket: "twrpbuilder.appspot.com",messagingSenderId: "1079738297898"}, "twrp");
  if(!globalVariables.listeners) globalVariables.listeners = [];
  if(!globalVariables.autol) globalVariables.autol = [];
  if(!globalVariables.devicename) globalVariables.devicename = (coden) => {
  	if(globalVariables.device[coden] !== undefined){
  		return globalVariables.device[coden].join(" | ");
  	} else {
  		return coden;
  	}
  }
  if(!globalVariables.createButtonCb){
    Discord.TextChannel.prototype.send = async function send(content, options) {
      if (this instanceof Discord.User || this instanceof Discord.GuildMember) {
        return this.createDM().then(dm => dm.send(content, options));
      }
  
      let apiMessage;
  
      if (content instanceof Discord.APIMessage) {
        apiMessage = content.resolveData();
      } else {
        apiMessage = Discord.APIMessage.create(this, content, options).resolveData();
        if (Array.isArray(apiMessage.data.content)) {
          return Promise.all(apiMessage.split().map(this.send.bind(this)));
        }
      }
  
      const { data, files } = await apiMessage.resolveFiles();
      if(options && options.components) data.components = options.components;
      return this.client.api.channels[this.id].messages
        .post({ data, files })
        .then(d => this.client.actions.MessageCreate.handle(d).message); 
    }
    Discord.DMChannel.prototype.send = async function send(content, options) {
      if (this instanceof Discord.User || this instanceof Discord.GuildMember) {
        return this.createDM().then(dm => dm.send(content, options));
      }
  
      let apiMessage;
  
      if (content instanceof Discord.APIMessage) {
        apiMessage = content.resolveData();
      } else {
        apiMessage = Discord.APIMessage.create(this, content, options).resolveData();
        if (Array.isArray(apiMessage.data.content)) {
          return Promise.all(apiMessage.split().map(this.send.bind(this)));
        }
      }
  
      const { data, files } = await apiMessage.resolveFiles();
      if(options && options.components) data.components = options.components;
      return this.client.api.channels[this.id].messages
        .post({ data, files })
        .then(d => this.client.actions.MessageCreate.handle(d).message); 
    }
    Discord.Message.prototype.edit = function edit(content, options) {
      const { data } =
        content instanceof Discord.APIMessage ? content.resolveData() : Discord.APIMessage.create(this, content, options).resolveData();
      if(options && options.components) data.components = options.components;
      return this.client.api.channels[this.channel.id].messages[this.id].patch({ data }).then(d => {
        const clone = this._clone();
        clone._patch(d);
        return clone;
      });
    }
    globalVariables.createButtonCb = (msg, id, cb) => {
      let offI = true;
      function buttonInt(interaction){
        if(interaction.type != 3) return;
        if(interaction.data.custom_id != id || msg.id != interaction.message.id) return;
        if(offI) client.ws.off('INTERACTION_CREATE', buttonInt);
        cb(interaction);
      }
      client.ws.on('INTERACTION_CREATE', buttonInt);
      return () => {offI = !offI};
    }
  }
}
