const queueManager = require("../queue/queueManager");
const MatchmakingEngine = require("../queue/matchmakingEngine");
const { createMatchAnnouncement } = require("../ui/matchAnnouncement");
const { refreshRankedPanel } = require("../utils/refreshRankedPanel");

const matchmakingEngine = new MatchmakingEngine(queueManager);

class MatchCreationService {

    async create(channel, queueName) {

        // Check if we can still create a match.
        if (!matchmakingEngine.canCreateMatch(queueName)) {
            return false;
        }

        const preview = matchmakingEngine.previewMatch(queueName);

        if (!preview) {
            return false;
        }

        console.log(
            `🥊 Creating match: ${preview.blueCorner.displayName} vs ${preview.redCorner.displayName}`
        );

        const match = matchmakingEngine.createMatch(queueName);

        if (!match) {
            return false;
        }

        // Reset countdown
        const queue = queueManager.getQueue(queueName);
        queue.countdown = null;

        // Send announcement
        await channel.send(
            createMatchAnnouncement(match)
        );

        // Refresh queue panel
        await refreshRankedPanel(queueName);

        console.log(
            `✅ Match ${match.id} successfully created.`
        );

        return match;

    }

}

module.exports = new MatchCreationService();