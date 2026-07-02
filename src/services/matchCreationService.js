const queueManager = require("../queue/queueManager");
const MatchmakingEngine = require("../queue/matchmakingEngine");
const { createMatchAnnouncement } = require("../ui/matchAnnouncement");
const { refreshRankedPanel } = require("../utils/refreshRankedPanel");

const matchmakingEngine = new MatchmakingEngine(queueManager);

class MatchCreationService {

    async create(channel, queueName) {

        // Verify there are still enough players.
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

        const queue = queueManager.getQueue(queueName);

        // Fully reset queue state.
        queue.countdown = null;

        // If no fighters remain, reset to an idle state.
        if (queue.players.length === 0) {
            queue.countdown = null;
        }

        // Send announcement.
        await channel.send(
            createMatchAnnouncement(match)
        );

        // Refresh the queue panel.
        await refreshRankedPanel(queueName);

        console.log(
            `✅ Match ${match.id} completed successfully.`
        );

        return match;
    }

}

module.exports = new MatchCreationService();