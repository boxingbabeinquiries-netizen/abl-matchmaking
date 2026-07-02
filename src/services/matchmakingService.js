const config = require("../config/config");
const queueManager = require("../queue/queueManager");
const countdownManager = require("../queue/countdownManager");
const MatchmakingEngine = require("../queue/MatchmakingEngine");
const matchCreationService = require("./matchCreationService");
const { refreshRankedPanel } = require("../utils/refreshRankedPanel");

const matchmakingEngine = new MatchmakingEngine(queueManager);

class MatchmakingService {

    async playerJoined(queueName, channel) {

        const queue = queueManager.getQueue(queueName);

        // Always refresh first.
        await refreshRankedPanel(queueName);

        // Need at least two players.
        if (!matchmakingEngine.canCreateMatch(queueName)) {
            return;
        }

        // Prevent duplicate countdowns.
        if (countdownManager.isRunning(queueName)) {
            return;
        }

        queue.countdown = config.queue[queueName].countdownSeconds;

        countdownManager.start(queueName, async (remaining) => {

            // Someone left during the countdown.
            if (queue.players.length < 2) {

                countdownManager.stop(queueName);

                queue.countdown = null;

                await refreshRankedPanel(queueName);

                return;
            }

            queue.countdown = remaining;

            await refreshRankedPanel(queueName);

            if (remaining <= 0) {

                queue.countdown = null;

                await matchCreationService.create(
                    channel,
                    queueName
                );

            }

        });

    }

    async playerLeft(queueName) {

        const queue = queueManager.getQueue(queueName);

        if (queue.players.length < 2) {

            countdownManager.stop(queueName);

            queue.countdown = null;

        }

        await refreshRankedPanel(queueName);

    }

}

module.exports = new MatchmakingService();