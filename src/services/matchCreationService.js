const queueManager = require("../queue/queueManager");
const MatchmakingEngine = require("../queue/matchmakingEngine");
const matchmakingService = require("./matchmakingService");
const { createMatchAnnouncement } = require("../ui/matchAnnouncement");
const { refreshRankedPanel } = require("../utils/refreshRankedPanel");

const matchmakingEngine = new MatchmakingEngine(queueManager);

class MatchCreationService {

    async create(channel, queueName) {

        if (!matchmakingEngine.canCreateMatch(queueName)) {
            return null;
        }

        const match = matchmakingEngine.createMatch(queueName);

        if (!match) {
            return null;
        }

        const queue = queueManager.getQueue(queueName);

        // Reset the countdown.
        queue.countdown = null;

        try {

            await channel.send(
                createMatchAnnouncement(match)
            );

            console.log(
                `🥊 Match created: ${match.blueCorner.displayName} vs ${match.redCorner.displayName}`
            );

        } catch (error) {

            console.error(
                "Failed to announce match:",
                error
            );

        }

        // Refresh the queue panel.
        await refreshRankedPanel(queueName);

        // NEW: Automatically start the next countdown if enough fighters remain.
        if (matchmakingEngine.canCreateMatch(queueName)) {

            console.log(
                `⏳ More fighters detected. Starting the next countdown...`
            );

            await matchmakingService.playerJoined(
                queueName,
                channel
            );

        }

        return match;

    }

}

module.exports = new MatchCreationService();