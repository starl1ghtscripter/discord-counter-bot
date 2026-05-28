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

// ➕ Add +1
app.post("/run", async (req, res) => {
  try {
    console.log("RUN endpoint triggered");
    counter++;

    const channel = await client.channels.fetch(VOICE_CHANNEL_ID);
    await channel.setName(`executions: ${counter}`);

    res.json({ success: true, counter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// 🔢 Set counter
app.post("/set", async (req, res) => {
  try {
    console.log("SET endpoint triggered");
    const value = req.body.value;

    if (typeof value !== "number") {
      return res.status(400).json({ error: "value must be a number" });
    }

    counter = value;

    const channel = await client.channels.fetch(VOICE_CHANNEL_ID);
    await channel.setName(`executions: ${counter}`);

    res.json({ success: true, counter });
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
