const queueManager = require("../queue/queueManager");
const queuePanelRepository = require("../database/queuePanelRepository");

class PanelRecoveryService {

    async restore(client) {

        console.log("🖼️ Restoring queue panels...");

        const panels = await queuePanelRepository.getAll();

        if (!panels.length) {

            console.log("📭 No persisted queue panels found.");
            return;

        }

        for (const panel of panels) {

            try {

                const channel = await client.channels.fetch(
                    panel.channelId
                );

                if (!channel) {

                    console.warn(
                        `⚠️ Unable to find channel for "${panel.queueName}".`
                    );

                    continue;

                }

                const message = await channel.messages.fetch(
                    panel.messageId
                );

                if (!message) {

                    console.warn(
                        `⚠️ Unable to find panel message for "${panel.queueName}".`
                    );

                    continue;

                }

                queueManager.setPanelMessage(
                    panel.queueName,
                    message
                );

                console.log(
                    `✅ Restored "${panel.queueName}" queue panel.`
                );

            } catch (error) {

                console.error(
                    `❌ Failed to restore "${panel.queueName}" panel.`
                );

                console.error(error);

            }

        }

    }

}

module.exports = new PanelRecoveryService();