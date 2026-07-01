const queueManager = require("../queue/queueManager");
const config = require("../config/config");
const matchmakingService = require("../services/matchmakingService");
const { BUTTONS, QUEUES } = require("../utils/constants");

module.exports = async (interaction) => {

    const maxPlayers = config.queue.ranked.maxPlayers;

    switch (interaction.customId) {

        case BUTTONS.JOIN_RANKED: {

            const result = queueManager.join(
                QUEUES.RANKED,
                interaction.member
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
                            content: `❌ The Ranked Queue is full (${maxPlayers}/${maxPlayers}).`,
                            ephemeral: true
                        });

                    default:
                        return interaction.reply({
                            content: "❌ Unable to join the Ranked Queue.",
                            ephemeral: true
                        });

                }

            }

            await matchmakingService.playerJoined(
                QUEUES.RANKED,
                interaction.channel
            );

            const players = queueManager.getPlayers(QUEUES.RANKED);

            return interaction.reply({
                content:
                    `🥊 The Commissioner has accepted you into the Ranked Queue!\n\n` +
                    `👥 Fighters waiting: **${players.length}/${maxPlayers}**`,
                ephemeral: true
            });

        }

        case BUTTONS.LEAVE_QUEUE: {

            const left = queueManager.leave(
                QUEUES.RANKED,
                interaction.member.id
            );

            if (!left) {
                return interaction.reply({
                    content: "❌ You are not currently in the Ranked Queue.",
                    ephemeral: true
                });
            }

            await matchmakingService.playerLeft(QUEUES.RANKED);

            const players = queueManager.getPlayers(QUEUES.RANKED);

            return interaction.reply({
                content:
                    `🚪 The Commissioner has removed you from the Ranked Queue.\n\n` +
                    `👥 Fighters waiting: **${players.length}/${maxPlayers}**`,
                ephemeral: true
            });

        }

    }

};