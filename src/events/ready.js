const { Events } = require("discord.js");
const config = require("../config/config");

const persistenceService = require("../services/persistenceService");
const matchmakingService = require("../services/matchmakingService");
const queueManager = require("../queue/queueManager");

const {
    QUEUES
} = require("../utils/constants");

module.exports = {
    name: Events.ClientReady,
    once: true,

    async execute(client) {

        console.clear();

        console.log("========================================");
        console.log(`🥊 ${config.bot.name}`);
        console.log(`Version: ${config.bot.version}`);
        console.log("----------------------------------------");
        console.log(`Logged in as: ${client.user.tag}`);
        console.log("----------------------------------------");

        //
        // Restore persisted queues.
        //
        try {

            await persistenceService.restoreQueues();

            console.log("💾 Queue restoration complete.");

        } catch (error) {

            console.error("❌ Failed to restore queues.");
            console.error(error);

        }

        //
        // Automatically restart matchmaking
        // if enough players remain queued.
        //
        try {

            const rankedQueue = queueManager.getQueue(
                QUEUES.RANKED
            );

            if (rankedQueue.players.length >= 2) {

                console.log(
                    "🥊 Ranked queue restored with enough fighters."
                );

                // We don't have a Discord channel after a restart,
                // so matchmaking will resume once the next interaction
                // occurs. Later we'll improve this by restoring the
                // original queue channel.

            }

        } catch (error) {

            console.error(error);

        }

        console.log("----------------------------------------");
        console.log("Bot is ready for fighters!");
        console.log("========================================");

    }

};