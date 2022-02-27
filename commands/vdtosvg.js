module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  const convert = require('xml-js');

  function VectorDrawableToSVG(text){
    let vector = JSON.parse(convert.xml2json(text, {compact: false})).elements[0];

    let svg = {
      "declaration":{
        "attributes":{
          "version":"1.0",
          "encoding":"utf-8"
        }
      },
      "elements":[{
        "type":"element",
        "name":"svg",
        "attributes":{
          "xmlns":"http://www.w3.org/2000/svg",
          "width":vector.attributes['android:viewportWidth'],
          "height":vector.attributes['android:viewportHeight'],
          "viewBox":`0 0 ${vector.attributes['android:viewportWidth']} ${vector.attributes['android:viewportHeight']}`
        },
        "elements":generateElement(vector.elements)
      }]
    };

    if(vector.attributes['android:alpha']) svg.elements[0].attributes["opacity"] = vector.attributes['android:alpha'];
    if(vector.attributes['android:autoMirrored'] === "true") svg.elements[0].attributes["transform"] = "scale(-1,1)";

    function generateElement(xml){
      let element = [];
      for(let elem of xml){
        if(elem.name == "path"){
          let path = {"type":"element","name":"path","attributes":{"d":elem.attributes['android:pathData']}};
          if(elem.attributes['android:fillColor']) path.attributes['fill'] = elem.attributes['android:fillColor'];
          else path.attributes['fill'] = 'none';
          if(elem.attributes['android:strokeLineJoin']) path.attributes['stroke-linejoin'] = elem.attributes['android:strokeLineJoin'];
          if(elem.attributes['android:strokeLineCap']) path.attributes['stroke-linecap'] = elem.attributes['android:strokeLineCap'];
          if(elem.attributes['android:strokeMiterLimit']) path.attributes['stroke-miterlimit'] = elem.attributes['android:strokeMiterLimit'];
          if(elem.attributes['android:strokeWidth']) path.attributes['stroke-width'] = elem.attributes['android:strokeWidth'];
          if(elem.attributes['android:strokeColor']) path.attributes['stroke'] = elem.attributes['android:strokeColor'];
          if(elem.attributes['android:fillAlpha']) path.attributes['fill-opacity'] = elem.attributes['android:fillAlpha'];
          if(elem.attributes['android:strokeAlpha']) path.attributes['stroke-opacity'] = elem.attributes['android:strokeAlpha'];
          if(elem.attributes['android:fillType']) path.attributes['fill-rule'] = elem.attributes['android:fillType'].toLowerCase();
          element.push(path);
        } else if(elem.name == "group"){
          let group = {"type":"element","name":"g","attributes":{},"elements":generateElement(elem.elements)};
          let transform = "";
          if(elem.attributes['android:rotation']){
            transform += `rotate(${elem.attributes['android:rotation']}`
            if(elem.attributes['android:pivotX']){
              transform += `,${elem.attributes['android:pivotX']}`
            } else {
              transform += `,0`
            } if(elem.attributes['android:pivotY']){
              transform += `,${elem.attributes['android:pivotY']}) `
            } else {
              transform += `,0) `
            }
          };
          let scale = {x:"1",y:"1"};
          if(elem.attributes['android:scaleX']) scale.x = elem.attributes['android:scaleX'];
          if(elem.attributes['android:scaleY']) scale.y = elem.attributes['android:scaleY'];
          if(scale.x !== "1" || scale.y !== "1") transform += `scale(${scale.x},${scale.y}) `;
          let translate = {x:"0",y:"0"};
          if(elem.attributes['android:translateX']) translate.x = elem.attributes['android:translateX'];
          if(elem.attributes['android:translateY']) translate.y = elem.attributes['android:translateY'];
          if(translate.x !== "0" || translate.y !== "0") transform += `translate(${translate.x},${translate.y}) `;
          if(transform !== "") group.attributes["transform"] = transform;
          element.push(group);
        }
      }
      return element;
    }

    return convert.json2xml(JSON.stringify(svg), {compact: false, ignoreComment: true, spaces: 2});
  }

  async function command(message){
    let attachment = message.attachments.first();
    if(attachment === undefined) return message.channel.send("Upload Android Vector Drawable (xml) in your message");
    try {
      var filename = attachment.name;
      console.log(filename);
			if(!filename.endsWith(".xml")) return message.channel.send("Upload Android Vector Drawable (xml) in your message");
      let xml = await fetch(attachment.url).then(res => res.text());
      try {
        let test = JSON.parse(convert.xml2json(xml, {compact: false})).elements[0];
        if(test.name !== "vector") return message.channel.send("Upload Android Vector Drawable (xml) in your message");
      } catch(e){
        console.log(e);
        return message.channel.send("Upload Android Vector Drawable (xml) in your message");
      }
      let svg = Buffer.from(VectorDrawableToSVG(xml));
      message.channel.send("", {
        files: [{
          attachment: svg,
          name: `${filename}.svg`
        }]
      })
    } catch(e){
      msg.edit(`An error occured, please retry later.`);
    }
  }

  command.options = {
    name: ["vdtosvg"],
    enable: true
  };

  command.help = {
    "category": "global",
    "description": "Android Vector Drawable to Scalable Vector Graphics (SVG)",
    "example": "{prefix}vdtosvg"
  }

  return command;
}
