const queueManager = require("../queue/queueManager");
const countdownManager = require("../queue/countdownManager");
const MatchmakingEngine = require("../queue/matchmakingEngine");
const matchCreationService = require("./matchCreationService");
const { refreshRankedPanel } = require("../utils/refreshRankedPanel");

const matchmakingEngine = new MatchmakingEngine(queueManager);

class MatchmakingService {

    async playerJoined(queueName, channel) {

        // Always refresh the panel first
        await refreshRankedPanel();

        // Not enough players yet
        if (!matchmakingEngine.canCreateMatch(queueName)) {
            return;
        }

        // Countdown already running
        if (countdownManager.isRunning(queueName)) {
            return;
        }

        // TEMPORARY:
        // Instantly create a match until we build the countdown.
        await matchCreationService.create(channel, queueName);
    }

    async playerLeft(queueName) {

        const players = queueManager.getPlayers(queueName);

        if (players.length < 2) {
            countdownManager.stop(queueName);
        }

        await refreshRankedPanel();
    }

}

module.exports = new MatchmakingService();