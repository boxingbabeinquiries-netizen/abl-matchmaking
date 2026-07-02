const { Events } = require("discord.js");
const config = require("../config/config");

const persistenceService = require("../services/persistenceService");
const panelRecoveryService = require("../services/panelRecoveryService");
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
        // Restore persisted queue members.
        //
        try {

            await persistenceService.restoreQueues();

            console.log("💾 Queue restoration complete.");

        } catch (error) {

            console.error("❌ Failed to restore queues.");
            console.error(error);

        }

        //
        // Restore persisted queue panels.
        //
        try {

            await panelRecoveryService.restore(client);

            console.log("🖼️ Queue panel restoration complete.");

        } catch (error) {

            console.error("❌ Failed to restore queue panels.");
            console.error(error);

        }

        //
        // Check whether matchmaking can immediately resume.
        //
        try {

            const rankedQueue = queueManager.getQueue(
                QUEUES.RANKED
            );

            if (rankedQueue.players.length >= 2) {

                console.log(
                    "🥊 Ranked queue restored with enough fighters."
                );

                console.log(
                    "⏳ A fresh matchmaking countdown will begin on the next queue interaction."
                );

            }

        } catch (error) {

            console.error(error);

        }

        console.log("----------------------------------------");
        console.log("Bot is ready for fighters!");
        console.log("========================================");

    }

};