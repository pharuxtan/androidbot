module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(message){
    if(message.author.id !== "254326758864715777") return;
    const content = message.content.toLowerCase();
    const channel = message.channel;
    const guild = message.guild;
    const member = message.member;
    const author = message.author;
    function send(msg) {
      channel.send(msg)
    };
    function sendmp(msg) {
      author.send(msg).catch(() => send(msg))
    };
    if (message.author.id === "254326758864715777") {
      if (content.startsWith(`.eval`)) {
        console.oldLog = console.log;
        console.log = function(value) {
          return value
        };

        function cut(text, length) {
          if (text == null) {
            return ""
          }
          if (text.length <= length) {
            return text
          }
          return text.substring(0, length)
        }
        let t = message.content.split(" ").slice(1).join(" ");

        function clean(text) {
          if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
          else return text
        }
        try {
          eval(t, {
            depth: 0
          }).then(e => {
            if (t) {
              let hS = process.hrtime();
              let hD;
              hD = process.hrtime(hS);
              if (typeof e !== "string") e = require("util").inspect(e);
              return send(`*Time: ${hD[0] > 0 ? `${hD[0]}s` : ''}${hD[1] / 1000000}ms.*\`\`\`xl\n${cut(clean(e), 1000)}\n\`\`\``)
            }
          }).catch(e => {
            send(`\`\`\`xl\n${clean(e)}\`\`\``)
          })
        } catch (e) {
          if (e.message === "eval(...).then is not a function" || e.message === "Cannot read property 'then' of undefined") {
            try {
              function cut(text, length) {
                if (text == null) {
                  return ""
                }
                if (text.length <= length) {
                  return text
                }
                return text.substring(0, length).substring(0, text.lastIndexOf(" "))
              }
              let t = message.content.split(" ").slice(1).join(" ");
              let e = eval(t);
              if (typeof e !== "function") {
                if (typeof e !== "string") e = require("util").inspect(e);
                if (t) {
                  let hS = process.hrtime();
                  let hD;
                  hD = process.hrtime(hS);
                  return send(`*Time: ${hD[0] > 0 ? `${hD[0]}s` : ''}${hD[1] / 1000000}ms.*\`\`\`xl\n${cut(clean(e), 1000)}\n\`\`\``)
                }
              } else {
                e = require("util").inspect(e.toString());
                if (t) {
                  let hS = process.hrtime();
                  let hD;
                  hD = process.hrtime(hS);
                  return send(`*Time: ${hD[0] > 0 ? `${hD[0]}s` : ''}${hD[1] / 1000000}ms.*\`\`\`xl\n${cut(clean(e), 1000)}\n\`\`\``)
                }
              }
            } catch (e) {
              message.channel.send(`\`\`\`xl\n${clean(e)}\n\`\`\``)
            }
          } else {
            send(`\`\`\`xl\n${clean(e)}\`\`\``)
          }
        }
      }
    }
  }

  command.options = {
    name: ["eval"],
    enable: true
  };

  return command;
}
