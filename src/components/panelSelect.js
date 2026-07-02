const {
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

module.exports = async (interaction) => {

    const selection = interaction.values[0];

    //
    // STEP 1 — GAME SELECTION
    //
    if (selection === "game_select") {

        const gameMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("game_select")
                .setPlaceholder("Select a game")
                .addOptions(
                    {
                        label: "🥊 Boxing Beta",
                        value: "boxing_beta"
                    },
                    {
                        label: "🥊 Untitled Boxing Game",
                        value: "ubg"
                    }
                )
        );

        return interaction.update({
            content: "🎮 Select the game you want to create a queue panel for:",
            components: [gameMenu]
        });
    }

    //
    // STEP 2 — GAME HAS BEEN SELECTED
    //
    if (selection === "boxing_beta" || selection === "ubg") {

        const queueMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`queue_select:${selection}`)
                .setPlaceholder("Select queue type")
                .addOptions(
                    {
                        label: "🥊 Ranked Queue",
                        value: "ranked"
                    },
                    {
                        label: "🎭 RP Queue",
                        value: "rp"
                    }
                )
        );

        return interaction.update({
            content: `🎯 Game selected: **${selection === "boxing_beta" ? "Boxing Beta" : "Untitled Boxing Game"}**

Now select a queue type:`,
            components: [queueMenu]
        });
    }

};