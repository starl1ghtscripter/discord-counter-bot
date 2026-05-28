require("dotenv").config();

const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

// ================= EXPRESS SERVER =================
const app = express();
app.use(express.json());

let counter = 0;

// Replace with your voice channel ID
const VOICE_CHANNEL_ID = "1509597107949146143";

// Health check (Render uses this to confirm it's alive)
app.get("/", (req, res) => {
  res.send("Bot is alive");
});

// ================= ROBLOX API =================

function parseCounter(name) {
  if (!name) return 0;

  const match = name.match(/([\d,]+)/);
  if (!match) return 0;

  return parseInt(match[1].replace(/,/g, ""), 10);
}

// ➕ Add +1
app.post("/run", async (req, res) => {
  console.log("RUN endpoint triggered");

  try {
    const channel = await client.channels.fetch(VOICE_CHANNEL_ID);

    // 1. Read current number from channel name
    const current = parseCounter(channel.name);

    // 2. Increment
    const updated = current + 1;

    // 3. Update channel name
    await channel.setName(
      `executions: ${updated}`
    );

    console.log("Updated counter:", updated);

    res.json({ success: true, counter: updated });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔢 Set counter
app.post("/set", async (req, res) => {
  try {
    const value = req.body.value;

    if (typeof value !== "number") {
      return res.status(400).json({ error: "value must be a number" });
    }

    const channel = await client.channels.fetch(VOICE_CHANNEL_ID);

    await channel.setName(
      `executions: ${value}`
    );

    res.json({ success: true, counter: value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Web server running on port " + PORT);
});

// ================= DISCORD BOT =================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
