const queueManager = require("../queue/queueManager");
const countdownManager = require("../queue/countdownManager");
const MatchmakingEngine = require("../queue/matchmakingEngine");
const matchCreationService = require("./matchCreationService");
const { refreshRankedPanel } = require("../utils/refreshRankedPanel");

const matchmakingEngine = new MatchmakingEngine(queueManager);

class MatchmakingService {

    async playerJoined(queueName, channel) {

        await refreshRankedPanel();

        if (!matchmakingEngine.canCreateMatch(queueName)) {
            return;
        }

        if (countdownManager.isRunning(queueName)) {
            return;
        }

        // Temporary: instantly create a match.
        // We'll replace this with a real countdown next sprint.
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