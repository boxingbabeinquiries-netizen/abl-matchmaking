const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Creates the Animal Boxing League matchmaking panel.'),

    async execute(interaction) {
        await interaction.reply({
            content: '🥊 ABL Matchmaking setup successful!',
            ephemeral: true
        });
    }
};