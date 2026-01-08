const axios = require("axios");

const GUILD_ID = "13649496777";
let guildCache = null;

async function fetchGuildData() {
  try {
    const url = `https://api.dailyspin.in/freefire/guild?guild_id=${GUILD_ID}`;
    const res = await axios.get(url);

    if (res.data && res.data.guild) {
      guildCache = {
        ...res.data.guild,
        lastUpdated: new Date().toISOString(),
        totalMembers: res.data.guild.members.length
      };
      console.log("Guild updated:", new Date().toLocaleTimeString());
    }
  } catch (err) {
    console.log("Error:", err.message);
  }
}

module.exports = {
  fetchGuildData,
  getGuildCache: () => guildCache
};
