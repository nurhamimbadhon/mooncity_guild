const axios = require("axios");

const GUILD_ID = "13649496777"; // your guild ID
let guildCache = null;

async function fetchGuildData() {
  try {
    const url = `https://api.dailyspin.in/freefire/guild?guild_id=${GUILD_ID}`;
    const res = await axios.get(url);

    if (res.data && res.data.guild) {
      guildCache = res.data.guild;
      console.log("Guild Updated:", new Date().toLocaleTimeString());
    } else {
      console.log("No guild data found!");
    }
  } catch (err) {
    console.log("Fetch Error:", err.message);
  }

  return guildCache;
}

module.exports = {
  fetchGuildData,
  getGuildCache: () => guildCache
};
