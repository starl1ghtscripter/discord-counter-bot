require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let counter = 0;

// Put your voice channel ID here
const VOICE_CHANNEL_ID = "YOUR_VOICE_CHANNEL_ID";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!run") {
    counter++;

    try {
      const channel = await client.channels.fetch(VOICE_CHANNEL_ID);
      if (!channel) return;

      await channel.setName(`🔊 Executions: ${counter}`);

      message.reply(`Done! Counter is now ${counter}`);
    } catch (err) {
      console.error(err);
    }
  }
});

client.login(process.env.TOKEN);