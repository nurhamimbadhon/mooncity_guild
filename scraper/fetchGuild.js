const axios = require("axios");
const cheerio = require("cheerio"); // HTML parser

const GUILD_ID = "3085195487";
let guildCache = null;

// BD server public lookup URL
const LOOKUP_URL = `https://ff.garena.com/guild/${GUILD_ID}`;

async function fetchGuildData() {
  try {
    const { data } = await axios.get(LOOKUP_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(data);

    let guildName = $("h1.guild-name").text().trim() || "Not Found";
    let leaderName = $(".leader-name").text().trim() || "Unknown";

    let members = [];

    $(".member-row").each((i, el) => {
      members.push({
        name: $(el).find(".member-name").text().trim(),
        level: parseInt($(el).find(".member-level").text().trim()) || 0,
        rank: $(el).find(".member-rank").text().trim() || "N/A",
        role: $(el).find(".member-role").text().trim() || "Member"
      });
    });

    guildCache = {
      guildId: GUILD_ID,
      guildName,
      leaderName,
      members,
      totalMembers: members.length,
      lastUpdated: new Date().toISOString()
    };

    console.log("BD Guild Updated:", guildName, members.length);

  } catch (err) {
    console.log("BD Scraper Error:", err.message);
  }

  return guildCache;
}

module.exports = {
  fetchGuildData,
  getGuildCache: () => guildCache
};
