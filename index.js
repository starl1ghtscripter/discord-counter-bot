require("dotenv").config();

const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

// ---------------- EXPRESS SERVER ----------------
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is alive");
});

// ---------------- DISCORD BOT ----------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let counter = 0;

// 🔧 PUT YOUR VOICE CHANNEL ID HERE
const VOICE_CHANNEL_ID = "1509597107949146143";

// ---------------- ROBLOX ENDPOINT ----------------
app.post("/run", async (req, res) => {
  try {
    counter++;

    const channel = await client.channels.fetch(VOICE_CHANNEL_ID);
    await channel.setName(`executions: ${counter}`);

    res.json({ success: true, counter });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false });
  }
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

// ---------------- BOT READY ----------------
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// ---------------- LOGIN BOT ----------------
client.login(process.env.TOKEN);
