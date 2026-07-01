const queueManager = require("../queue/queueManager");
const config = require("../config/config");
const { refreshRankedPanel } = require("../utils/refreshRankedPanel");
const { BUTTONS, QUEUES } = require("../utils/constants");

module.exports = async (interaction) => {

    const maxPlayers = config.queue.ranked.maxPlayers;

    switch (interaction.customId) {

        case BUTTONS.JOIN_RANKED: {

            const result = queueManager.join(
                QUEUES.RANKED,
                interaction.user
            );

            if (!result.success) {

                switch (result.reason) {

                    case "ALREADY_IN_QUEUE":
                        return interaction.reply({
                            content: "❌ You are already in a matchmaking queue.",
                            ephemeral: true
                        });

                    case "QUEUE_FULL":
                        return interaction.reply({
                            content: `❌ The Ranked Queue is currently full (${maxPlayers}/${maxPlayers}).`,
                            ephemeral: true
                        });

                    default:
                        return interaction.reply({
                            content: "❌ Unable to join the Ranked Queue.",
                            ephemeral: true
                        });
                }
            }

            await refreshRankedPanel();

            const players = queueManager.getPlayers(QUEUES.RANKED);

            return interaction.reply({
                content:
                    `🥊 You joined the Ranked Queue!\n\n` +
                    `👥 Fighters waiting: **${players.length}/${maxPlayers}**`,
                ephemeral: true
            });
        }

        case BUTTONS.LEAVE_QUEUE: {

            const left = queueManager.leave(
                QUEUES.RANKED,
                interaction.user.id
            );

            if (!left) {
                return interaction.reply({
                    content: "❌ You are not currently in the Ranked Queue.",
                    ephemeral: true
                });
            }

            await refreshRankedPanel();

            const players = queueManager.getPlayers(QUEUES.RANKED);

            return interaction.reply({
                content:
                    `🚪 You left the Ranked Queue.\n\n` +
                    `👥 Fighters waiting: **${players.length}/${maxPlayers}**`,
                ephemeral: true
            });
        }

    }

};