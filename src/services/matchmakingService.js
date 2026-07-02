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

        const queue = queueManager.getQueue(queueName);

        queue.countdown = 120;

        countdownManager.start(queueName, async (seconds) => {

            queue.countdown = seconds;

            await refreshRankedPanel();

            // Countdown cancelled because someone left
            if (queue.players.length < 2) {
                countdownManager.stop(queueName);
                queue.countdown = null;

                await refreshRankedPanel();
                return;
            }

            if (seconds === 0) {
                await matchCreationService.create(channel, queueName);
                queue.countdown = null;
            }

        });

    }

    async playerLeft(queueName) {

        const queue = queueManager.getQueue(queueName);

        if (queue.players.length < 2) {
            countdownManager.stop(queueName);
            queue.countdown = null;
        }

        await refreshRankedPanel();

    }

}

module.exports = new MatchmakingService();