const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel")
        .setDescription("Create an ABL matchmaking panel."),

    async execute(interaction) {
        await interaction.reply({
            content: "🥊 Panel system coming soon!",
            ephemeral: true
        });
    }
};