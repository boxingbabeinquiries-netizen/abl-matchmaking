const { Events } = require("discord.js");
const config = require("../config/config");

module.exports = {
    name: Events.ClientReady,
    once: true,

    execute(client) {
        console.clear();

        console.log("========================================");
        console.log(`🥊 ${config.bot.name}`);
        console.log(`Version: ${config.bot.version}`);
        console.log("----------------------------------------");
        console.log(`Logged in as: ${client.user.tag}`);
        console.log("Bot is ready for fighters!");
        console.log("========================================");
    }
};