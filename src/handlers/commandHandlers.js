const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

module.exports = (client) => {
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, "..", "commands");
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));

        client.commands.set(command.data.name, command);

        console.log(`✅ Loaded command: ${command.data.name}`);
    }
};