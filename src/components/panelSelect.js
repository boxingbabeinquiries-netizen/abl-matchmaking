const { createRankedPanel } = require("../ui/rankedPanel");
const queueManager = require("../queue/queueManager");

module.exports = async (interaction) => {

    const selection = interaction.values[0];

    switch (selection) {

        case "ranked": {

            const message = await interaction.channel.send(
                createRankedPanel()
            );

            queueManager.setPanelMessage("ranked", message);

            await interaction.update({
                content: "✅ Ranked Queue panel created successfully!",
                components: []
            });

            break;
        }

        case "rp": {

            await interaction.update({
                content: "🎭 RP Queue coming soon!",
                components: []
            });

            break;
        }

    }

};