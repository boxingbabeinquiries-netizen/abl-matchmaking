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

        // Make sure the command has the expected structure
        if (!command.data || !command.execute) {
            console.warn(`⚠️ Skipping invalid command file: ${file}`);
            continue;
        }

        const data = command.data.toJSON();

        client.commands.set(data.name, command);

        console.log(`✅ Loaded command: ${data.name}`);
    }
};