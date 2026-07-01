require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const config = require("./config/config");
const loadCommands = require("./handlers/commandHandler");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.once("ready", () => {
    console.clear();

    console.log("========================================");
    console.log(`🥊 ${config.bot.name}`);
    console.log(`Version: ${config.bot.version}`);
    console.log("----------------------------------------");
    console.log(`Logged in as: ${client.user.tag}`);
    console.log("Bot is ready for fighters!");
    console.log("========================================");
});

client.login(process.env.DISCORD_TOKEN);