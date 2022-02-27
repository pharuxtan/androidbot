module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  const DWebp = require('cwebp').DWebp;

  async function WebPtoBuffer(buf){
    try {
      let b = await fetch(buf).then(res => res.buffer());
      const decoder = new DWebp(b);
      return await decoder.toBuffer();
    } catch(e){
      return buf;
    }
  }

  async function search(srch) {
    return new Promise(async function(resolve, reject) {
      try {
        let headers = { "Content-Type": "application/x-www-form-urlencoded", "X-Requested-With": "XMLHttpRequest", "Referer": "https://www.phonearena.com/phones/size" }
        let phones = await fetch(`https://www.phonearena.com/phones/size`, {method: "POST", body: `phone_name=${srch}&items=[]`, headers}).then(res => res.json());
        let devices = [];
        let names = [];
        if(phones.length == 0) resolve(false);
        for(let phone of phones){
          names.push(phone.label);
          devices.push({id: phone.value, name: phone.label});
        }
        let nnames = names.map(n => n.toLowerCase().replace(/\s/g, ""));
        let result = nnames.filter(n => n.endsWith(srch.toLowerCase().replace(/\s/g, "")));
        if (result[0] !== undefined) {
          resolve(devices[nnames.indexOf(result[0])]);
        } else {
          result = FuzzySearch(names, srch);
          if(result[0] !== undefined){
            resolve(devices[result[0]]);
          } else {
            resolve(devices[0]);
          }
        }
      } catch (e) {
        resolve(false)
      }
    });
  }

  const jimp = require('jimp');
  const Canvas = require('canvas');

  Canvas.CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    return this;
  }

  async function command(message){
    let msg = undefined;
    try{
      let phones = message.content.split(" ").slice(1).join(" ").split(/(\n|\r)+$/)[0].split("|").map(n => n.trim().split("\n")[0]);
      let help = false;
      let array = [];
      if(phones.length == 0) help = true;
      for(let i in phones){
        if(i < 7){
          if(phones[i] === "" || phones[i] === undefined){
            help = true;
          }
          array.push(phones[i]);
        }
      }
      if(help) return message.channel.send("Please enter 1 or more (up to 7) phone");
      msg = await message.channel.send(`Searching Phone Size for \`${array.join("` - `")}\`...`);
      let devices = [];
      let notfound = [];
      for(let i in array){
        let result = await search(array[i]);
        if(result === false){
          notfound.push(array[i]);
        } else {
          devices.push(result);
        }
      }
      if(devices.length == 0) return msg.edit(`No phones found for \`${notfound.join("` - `")}\``);
      let psize = [];
      let headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edg/89.0.774.57",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
      }
      for(let i=0; i < devices.length; i+=3){
        let dev = devices.slice(i, i+3);
        let html = require("node-html-parser").parse(await fetch(`https://www.phonearena.com/phones/size//phones/${dev.map(d => d.id).join(",")}`, {headers}).then(res => res.text()));
        psize = psize.concat(html.querySelector(".widgetSizeCompare__compare_standardView").childNodes.filter(n => n.nodeType !== 3));
        html.querySelector(".widgetSizeCompare__compare_labels").childNodes.filter(n => n.nodeType !== 3).map((phone, i) => {
          dev[i].dim = phone.querySelector(".widgetSizeCompare__compare_labels_label_specs_dimensions").childNodes[0].rawText.trim();
          dev[i].weight = phone.querySelector(".widgetSizeCompare__compare_labels_label_specs_weight").childNodes[0].rawText.trim();
        });
      }
      psize.map(phone => {
        let id = phone.rawAttrs.split('data-id="')[1].split('"')[0];
        let height,front,side,frontw,sidew = false;
        if(phone.querySelector(".widgetSizeCompare__phoneTemplate_phone_image_middle") != null){
          let imgs = phone.querySelector(".widgetSizeCompare__phoneTemplate_phone_image_middle").childNodes.filter(n => n.nodeType !== 3);
          height = parseFloat(imgs[0].rawAttrs.split('height="')[1].split('"')[0].split(";")[0]);
          try {
            front = phone.querySelector(".widgetSizeCompare__phoneTemplate_phone_image_middle_front").rawAttrs.split('src="')[1].split('"')[0].split(";")[0];
          } catch(e){
            let size = imgs[1];
            height = parseFloat(size.rawAttrs.split('style="')[1].split("height:")[1].split('"')[0].split(";")[0].trim());
            frontw = parseFloat(size.rawAttrs.split('style="')[1].split("width:")[1].split('"')[0].split(";")[0].trim());
            front = Canvas.createCanvas(Math.trunc(frontw), Math.trunc(height));
            let ctx = front.getContext("2d");
            ctx.fillStyle = "#999999";
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#999999";
            let pourcent = (n,p) => (p*n)/100;
            ctx.roundRect(pourcent(frontw,35),pourcent(height,3),pourcent(frontw,30),pourcent(height,2),3);
            ctx.fill();
            ctx.fillRect(pourcent(frontw,5),pourcent(height,8),pourcent(frontw,90),pourcent(height,82));
            ctx.roundRect(pourcent(frontw,40),pourcent(height,93),pourcent(frontw,20),pourcent(height,4),3);
            ctx.fill();
            ctx.roundRect(0,0,frontw,height,20);
            ctx.stroke();
            var imgf = front.toBuffer();
            front = imgf;
          }
          try {
            side = phone.querySelector(".widgetSizeCompare__phoneTemplate_phone_image_middle_side").rawAttrs.split('src="')[1].split('"')[0].split(";")[0];
          } catch(e){
            let size = imgs[1];
            height = parseFloat(size.rawAttrs.split('style="')[1].split("height:")[1].split('"')[0].split(";")[0].trim());
            sidew = parseFloat(size.rawAttrs.split('style="')[1].split("width:")[1].split('"')[0].split(";")[0].trim());
            side = Canvas.createCanvas(Math.trunc(sidew), Math.trunc(height));
            let ctx = side.getContext("2d");
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#999999";
            ctx.roundRect(0,0,sidew,height,20);
            ctx.stroke();
            var imgsi = side.toBuffer();
            side = imgsi;
          }
        } else {
          let size = phone.querySelector(".widgetSizeCompare__phoneTemplate_phone_blank").childNodes.filter(n => n.nodeType !== 3);
          height = parseFloat(size[0].rawAttrs.split('style="')[1].split("height:")[1].split('"')[0].split(";")[0].trim());
          frontw = parseFloat(size[0].rawAttrs.split('style="')[1].split("width:")[1].split('"')[0].split(";")[0].trim());
          sidew = parseFloat(size[1].rawAttrs.split('style="')[1].split("width:")[1].split('"')[0].split(";")[0].trim());
          side = Canvas.createCanvas(Math.trunc(sidew), Math.trunc(height));
          front = Canvas.createCanvas(Math.trunc(frontw), Math.trunc(height));
          let ctx = front.getContext("2d");
          ctx.fillStyle = "#999999";
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#999999";
          let pourcent = (n,p) => (p*n)/100;
          ctx.roundRect(pourcent(frontw,35),pourcent(height,3),pourcent(frontw,30),pourcent(height,2),3);
          ctx.fill();
          ctx.fillRect(pourcent(frontw,5),pourcent(height,8),pourcent(frontw,90),pourcent(height,82));
          ctx.roundRect(pourcent(frontw,40),pourcent(height,93),pourcent(frontw,20),pourcent(height,4),3);
          ctx.fill();
          ctx.roundRect(0,0,frontw,height,20);
          ctx.stroke();
          ctx = side.getContext("2d");
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#999999";
          ctx.roundRect(0,0,sidew,height,20);
          ctx.stroke();
          var imgf = front.toBuffer();
          var imgsi = side.toBuffer();
          front = imgf;
          side = imgsi;
        }
        devices.find(d => d.id == id).height = height;
        devices.find(d => d.id == id).front = front;
        devices.find(d => d.id == id).side = side;
      });
      devices.sort((a,b) => b.height-a.height);
      let colors = [{rgb:"rgba(107,170,232,1)",emoji:"🔵"},{rgb:"rgba(203,63,73,1)",emoji:"🔴"},{rgb:"rgba(132,175,99,1)",emoji:"🟢"},{rgb:"rgba(243,176,78,1)",emoji:"🟡"},{rgb:"rgba(165,143,209,1)",emoji:"🟣"},{rgb:"rgba(243,176,78,1)",emoji:"🟠"},{rgb:"rgba(181,109,85,1)",emoji:"🟤"}]
      let ndevices = [];
      let idseen = [];
      for(let d of devices){
        if(idseen.includes(d.id)) continue;
        ndevices.push(d);
        idseen.push(d.id);
      }
      devices = ndevices;
      for(let i in devices){
        let front = await jimp.read(await WebPtoBuffer(devices[i].front));
        let side = await jimp.read(await WebPtoBuffer(devices[i].side));
        let op = 0.5;
        if(devices.length === 1) op = 1;
        front.resize(jimp.AUTO, Math.trunc(devices[i].height)).opacity(op);
        side.resize(jimp.AUTO, Math.trunc(devices[i].height)).opacity(op);
        let f = new Canvas.Image;
        let s = new Canvas.Image;
        f.src = await front.getBufferAsync(jimp.MIME_PNG);
        s.src = await side.getBufferAsync(jimp.MIME_PNG);
        devices[i].front = f;
        devices[i].side = s;
        devices[i].frontw = f.width;
        devices[i].sidew = s.width;
        devices[i].color = colors[i];
      }
      for(let i in devices){
        let front = Canvas.createCanvas(Math.trunc(devices[i].front.width), Math.trunc(devices[i].front.height));
        let side = Canvas.createCanvas(Math.trunc(devices[i].side.width), Math.trunc(devices[i].side.height));
        let cf = front.getContext("2d");
        let cs = side.getContext("2d");
        cf.drawImage(devices[i].front,0,0);
        cs.drawImage(devices[i].side,0,0);
        cf.strokeStyle = devices[i].color.rgb;
        cf.lineWidth = 4;
        cs.strokeStyle = devices[i].color.rgb;
        cs.lineWidth = 4;
        cf.strokeRect(0, 0, Math.trunc(devices[i].front.width), Math.trunc(devices[i].front.height));
        cs.strokeRect(0, 0, Math.trunc(devices[i].side.width), Math.trunc(devices[i].side.height));
        var imgf = new Canvas.Image;
        imgf.src = front.toBuffer();
        var imgs = new Canvas.Image;
        imgs.src = side.toBuffer();
        devices[i].front = imgf;
        devices[i].side = imgs;
      }
      let px = 10;
      let w = JSON.parse(JSON.stringify(devices)).sort((a,b) => b.frontw-a.frontw)[0].frontw + px + JSON.parse(JSON.stringify(devices)).sort((a,b) => b.sidew-a.sidew)[0].sidew;
      let h = JSON.parse(JSON.stringify(devices)).sort((a,b) => b.height-a.height)[0].height;
      let image = Canvas.createCanvas(w,h);
      let ctx = image.getContext("2d");
      let e = new Discord.MessageEmbed()
        .setFooter("Phone Arena");
      let desc = "";
      for(let i in devices){
        ctx.drawImage(devices[i].front, 0, h - devices[i].height);
        ctx.drawImage(devices[i].side, JSON.parse(JSON.stringify(devices)).sort((a,b) => b.frontw-a.frontw)[0].frontw + px, h - devices[i].height);
        desc += `**${devices[i].color.emoji}: ${devices[i].name}**\n${devices[i].dim} | ${devices[i].weight}\n`;
      }
      desc += `[Link](https://www.phonearena.com/phones/size//phones/${devices.map(d => d.id).join(",")})`;
      if(notfound.length > 0){
        desc += `\nNo phones found for \`${notfound.join("` - `")}\``
      }
      e.setDescription(desc);
      let mesg = await message.channel.send("**Size comparison**", {
        embed: e,
        files: [{
          attachment: image.toBuffer(),
          name: 'image.png'
        }],
        components: [
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
        ]
      });
      if(message.slash){
        if(message.channel.type == "dm"){
          msg.edit(`https://discord.com/channels/@me/${message.channel.id}/${mesg.id}`);
        } else {
          msg.edit(`https://discord.com/channels/${message.guild.id}/${message.channel.id}/${mesg.id}`);
        }
      } else {
        msg.delete();
      }
      createButtonCb(mesg, "delete", (interaction) => {
        client.api.interactions(interaction.id, interaction.token).callback.post({data:{type: 6}});
        let user = interaction.member ? interaction.member.user : interaction.user;
        if(message.channel.type == "dm"){
          if(user.id !== client.user.id && !user.bot && user.id === message.author.id){
            msg.delete();
            mesg.delete();
          }
        } else {
          if(user.id !== client.user.id && !user.bot && (user.id === message.author.id || mesg.guild.members.cache.get(user.id).hasPermission("MANAGE_MESSAGES", false, true, true))){
            msg.delete();
            mesg.delete();
          }
        }
      });
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
    name: ["psize"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Compare phone size with maximum of 7 phones (sources: [phonearena](http://phonearena.com/))",
    "example": "{prefix}psize Redmi Note 5 | Redmi Note 7"
  }

  return command;
}
