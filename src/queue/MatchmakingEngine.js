class MatchmakingEngine {

    constructor(queueManager) {
        this.queueManager = queueManager;
    }

    /**
     * Returns true if a queue has enough players
     * to create a match.
     */
    canCreateMatch(queueName) {

        const queue = this.queueManager.getQueue(queueName);

        if (!queue) {
            return false;
        }

        return queue.players.length >= 2;
    }

    /**
     * Returns the next two fighters
     * without removing them.
     */
    previewMatch(queueName) {

        const queue = this.queueManager.getQueue(queueName);

        if (!queue || queue.players.length < 2) {
            return null;
        }

        return {
            blueCorner: queue.players[0],
            redCorner: queue.players[1]
        };
    }

    /**
     * Creates the next match using FIFO.
     */
    createMatch(queueName) {

        const queue = this.queueManager.getQueue(queueName);

        if (!queue || queue.players.length < 2) {
            return null;
        }

        const blueCorner = queue.players.shift();
        const redCorner = queue.players.shift();

        return {
            id: crypto.randomUUID(),

            queue: queueName,

            createdAt: new Date(),

            blueCorner,

            redCorner
        };

    }

    /**
     * Returns the current queue size.
     */
    getQueueSize(queueName) {

        const queue = this.queueManager.getQueue(queueName);

        if (!queue) {
            return 0;
        }

        return queue.players.length;
    }

}

const crypto = require("crypto");

module.exports = MatchmakingEngine;