const {
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel")
        .setDescription("Create an Animal Boxing League queue panel."),

    async execute(interaction) {

        const menu = new StringSelectMenuBuilder()
            .setCustomId("panel_select")
            .setPlaceholder("Choose a queue panel...")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Ranked Queue")
                    .setDescription("Create the Ranked matchmaking panel.")
                    .setEmoji("🥊")
                    .setValue("ranked"),

                new StringSelectMenuOptionBuilder()
                    .setLabel("RP Queue")
                    .setDescription("Create the RP matchmaking panel.")
                    .setEmoji("🎭")
                    .setValue("rp")
            );

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({
            content: "Choose which matchmaking panel you'd like to create.",
            components: [row],
            ephemeral: true
        });
    }
};