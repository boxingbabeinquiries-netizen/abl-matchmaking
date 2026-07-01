const { createRankedPanel } = require("../ui/rankedPanel");

module.exports = async (interaction) => {

    const selection = interaction.values[0];

    switch (selection) {

        case "ranked":

            await interaction.channel.send(
                createRankedPanel()
            );

            await interaction.update({
                content: "✅ Ranked queue panel created successfully!",
                components: []
            });

            break;

        case "rp":

            await interaction.update({
                content: "🎭 RP Queue is coming in the next sprint!",
                components: []
            });

            break;

    }

};