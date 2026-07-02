const { createRankedPanel } = require("../ui/rankedPanel");
const queueManager = require("../queue/queueManager");
const queuePanelRepository = require("../database/queuePanelRepository");

module.exports = async (interaction) => {

    const selection = interaction.values[0];

    switch (selection) {

        case "ranked": {

            const message = await interaction.channel.send(
                createRankedPanel()
            );

            queueManager.setPanelMessage("ranked", message);

            //
            // Persist this panel so it can be restored after a restart.
            //
            await queuePanelRepository.save(
                "ranked",
                interaction.channel.id,
                message.id
            );

            console.log(
                `💾 Saved Ranked Queue panel (${message.id})`
            );

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