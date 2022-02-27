module.exports = (globalVariables) => {
  Object.keys(globalVariables).map(variable => {
    global[variable] = globalVariables[variable];
  });

  async function command(slash){
    slash.callMessageEvent();
  }

  command.options = {
    name: [
      /* normal */
      "battery", "cdn", "gplay", "gsm", "help", "invite", "miui", "ping", "psize", "smcdn", "support", "xiaomieu",
      /* roms */
      "roms", "aex", "aicp", "aosip", "arrow", "btlg", "crdroid", "dirtyunicorns", "evox", "havoc", "ion", "los", "msm", "nitrogen", "paranoid", "pixelexperience", "posp", "superior"
    ],
    enable: true
  };

  return command;
}
