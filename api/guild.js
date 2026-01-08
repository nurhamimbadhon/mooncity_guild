const express = require("express");
const router = express.Router();

const { getGuildCache } = require("../scraper/fetchGuild");

router.get("/", (req, res) => {
  const data = getGuildCache();
  if (!data) return res.json({ success: false, msg: "Guild loading..." });

  res.json({
    success: true,
    guild: data
  });
});

module.exports = router;
