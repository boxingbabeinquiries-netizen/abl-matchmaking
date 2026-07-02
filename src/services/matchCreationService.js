const queueManager = require("../queue/queueManager");
const MatchmakingEngine = require("../queue/matchmakingEngine");
const { createMatchAnnouncement } = require("../ui/matchAnnouncement");
const { refreshRankedPanel } = require("../utils/refreshRankedPanel");

const matchmakingEngine = new MatchmakingEngine(queueManager);

class MatchCreationService {

    async create(channel, queueName) {

        const queue = queueManager.getQueue(queueName);

        // Make sure enough players are still queued
        if (!matchmakingEngine.canCreateMatch(queueName)) {
            return false;
        }

        const match = matchmakingEngine.createMatch(queueName);

        if (!match) {
            return false;
        }

        // Stop any active countdown
        queue.countdown = null;

        // Announce the match
        await channel.send(
            createMatchAnnouncement(match)
        );

        // Update the queue panel
        await refreshRankedPanel();

        console.log(
            `[${queueName}] Match created: ${match.blueCorner.displayName} vs ${match.redCorner.displayName}`
        );

        return true;
    }

}

module.exports = new MatchCreationService();