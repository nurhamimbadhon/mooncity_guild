const express = require("express");
const router = express.Router();

const { getGuildCache } = require("../scraper/fetchGuild");

router.get("/", (req, res) => {
  const guild = getGuildCache();

  if (!guild)
    return res.json({ success: false, msg: "Guild data loading..." });

  res.json({
    success: true,
    guild
  });
});

module.exports = router;
