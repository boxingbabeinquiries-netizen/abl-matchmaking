const config = require("../config/config");
const queueManager = require("../queue/queueManager");
const countdownManager = require("../queue/countdownManager");
const MatchmakingEngine = require("../queue/matchmakingEngine");
const matchCreationService = require("./matchCreationService");
const { refreshRankedPanel } = require("../utils/refreshRankedPanel");

const matchmakingEngine = new MatchmakingEngine(queueManager);

class MatchmakingService {

    async playerJoined(queueName, channel) {

        const queue = queueManager.getQueue(queueName);

        await refreshRankedPanel(queueName);

        // Not enough players to begin matchmaking.
        if (!matchmakingEngine.canCreateMatch(queueName)) {
            return;
        }

        // Prevent multiple countdowns.
        if (countdownManager.isRunning(queueName)) {
            return;
        }

        queue.countdown = config.queue[queueName].countdownSeconds;

        countdownManager.start(queueName, async (remaining) => {

            // Countdown cancelled because someone left.
            if (queue.players.length < 2) {

                countdownManager.stop(queueName);

                queue.countdown = null;

                await refreshRankedPanel(queueName);

                return;
            }

            queue.countdown = remaining;

            await refreshRankedPanel(queueName);

            // Countdown finished.
            if (remaining <= 0) {

                queue.countdown = null;

                const created = await matchCreationService.create(
                    channel,
                    queueName
                );

                if (created) {
                    await refreshRankedPanel(queueName);
                }

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