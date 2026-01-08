const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const path = require("path");

const { fetchGuildData } = require("./scraper/fetchGuild");
const guildAPI = require("./api/guild");

const app = express();
app.use(cors());

app.use(express.static("public"));
app.use("/api/guild", guildAPI);

// Fetch every 30 sec
cron.schedule("*/30 * * * * *", fetchGuildData);

// Initial fetch
fetchGuildData();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
