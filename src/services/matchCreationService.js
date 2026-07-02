const queueManager = require("../queue/queueManager");
const MatchmakingEngine = require("../queue/matchmakingEngine");
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

        // Reset countdown state
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

        // Always refresh the queue afterwards
        await refreshRankedPanel(queueName);

        return match;

    }

}

module.exports = new MatchCreationService();