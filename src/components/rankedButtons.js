const queueManager = require("../queue/queueManager");
const matchmakingService = require("../services/matchmakingService");

const {
    BUTTONS,
    QUEUES,
    QUEUE_RESULTS
} = require("../utils/constants");

const config = require("../config/config");

module.exports = async (interaction) => {

    switch (interaction.customId) {

        case BUTTONS.JOIN_RANKED: {

            const result = queueManager.join(
                QUEUES.RANKED,
                interaction.member
            );

            if (!result.success) {

                switch (result.reason) {

                    case QUEUE_RESULTS.ALREADY_IN_QUEUE:
                        return interaction.reply({
                            content: "❌ You are already in a matchmaking queue.",
                            ephemeral: true
                        });

                    case QUEUE_RESULTS.QUEUE_FULL:
                        return interaction.reply({
                            content: `❌ The Ranked Queue is full (${config.queue.ranked.maxPlayers}/${config.queue.ranked.maxPlayers}).`,
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

            return interaction.reply({
                content: "🥊 **The Commissioner** has accepted you into the Ranked Queue.",
                ephemeral: true
            });

        }

        case BUTTONS.LEAVE_QUEUE: {

            const success = queueManager.leave(
                QUEUES.RANKED,
                interaction.member.id
            );

            if (!success) {

                return interaction.reply({
                    content: "❌ You are not currently in the Ranked Queue.",
                    ephemeral: true
                });

            }

            await matchmakingService.playerLeft(
                QUEUES.RANKED
            );

            return interaction.reply({
                content: "🚪 **The Commissioner** has removed you from the Ranked Queue.",
                ephemeral: true
            });

        }

    }

};