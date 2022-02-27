module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    if(message.author.id !== "254326758864715777") return;
    try {
      let specify = message.content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(' ')[1];
      let latest = await fetch("https://vanced.app/api/v1/latest.json").then(res => res.json());
      console.log(genFromLatestJson(latest).vanced.nonroot);
      if(specify == "manager"){

      } else if(specify == "vanced"){

      } else if(specify == "music"){

      } else if(specify == "microg"){

      } else {

      }
    } catch(e){
      message.channel.send(`An error occured, please retry later.`);
    }
  }

  function genFromLatestJson(latest){
    let json = {
      manager: {
        version: latest.manager.version,
        download: latest.manager.url,
      },
      vanced: {
        version: latest.vanced.version,
        nonroot: {
          dark: `https://vanced.app/api/v1/apks/v${latest.vanced.version}/nonroot/Theme/dark.apk`,
          black: `https://vanced.app/api/v1/apks/v${latest.vanced.version}/nonroot/Theme/black.apk`,
          arch: {
            x86: `https://vanced.app/api/v1/apks/v${latest.vanced.version}/nonroot/Arch/split_config.x86.apk`,
            arm64_v8a: `https://vanced.app/api/v1/apks/v${latest.vanced.version}/nonroot/Arch/split_config.arm64_v8a.apk`,
            armeabi_v7a: `https://vanced.app/api/v1/apks/v${latest.vanced.version}/nonroot/Arch/split_config.armeabi_v7a.apk`
          },
          languages: genFromLang(latest.vanced.version, latest.vanced.langs, "nonroot")
        },
        root: {
          dark: `https://vanced.app/api/v1/apks/v${latest.vanced.version}/root/Theme/dark.apk`,
          black: `https://vanced.app/api/v1/apks/v${latest.vanced.version}/root/Theme/black.apk`,
          stock: `https://vanced.app/api/v1/apks/v${latest.vanced.version}/root/Theme/stock.apk`,
          dpi: `https://vanced.app/api/v1/apks/v${latest.vanced.version}/root/Theme/dpi.apk`,
          arch: {
            x86: `https://vanced.app/api/v1/apks/v${latest.vanced.version}/root/Arch/split_config.x86.apk`,
            arm64_v8a: `https://vanced.app/api/v1/apks/v${latest.vanced.version}/root/Arch/split_config.arm64_v8a.apk`,
            armeabi_v7a: `https://vanced.app/api/v1/apks/v${latest.vanced.version}/root/Arch/split_config.armeabi_v7a.apk`
          },
          languages: genFromLang(latest.vanced.version, latest.vanced.langs, "root")
        }
      },
      music: {
        version: latest.music.version,
        download: `https://vanced.app/api/v1/music/v${latest.music.version}.apk`
      },
      microg: {
        version: latest.microg.version,
        download: latest.microg.url
      }
    }
    return json
  }

  function genFromLang(version, langs, root){
    let json = [];
    langs.map((lang) => {
      json.push({
        lang,
        download: `https://vanced.app/api/v1/apks/v${version}/${root}/Language/split_config.${lang}.apk`
      })
    })
    return json;
  }

  command.options = {
    name: ["vanced"],
    enable: true
  };

  return command;
}
