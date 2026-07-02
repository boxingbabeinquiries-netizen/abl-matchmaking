const crypto = require("crypto");

class MatchmakingEngine {

    constructor(queueManager) {
        this.queueManager = queueManager;
    }

    canCreateMatch(queueName) {

        const queue = this.queueManager.getQueue(queueName);

        if (!queue) return false;

        return queue.players.length >= 2;
    }

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

    createMatch(queueName) {

        const queue = this.queueManager.getQueue(queueName);

        if (!queue || queue.players.length < 2) {
            return null;
        }

        const blueCorner = queue.players.shift();
        const redCorner = queue.players.shift();

        // 🧠 CREATE MATCH OBJECT (UNCHANGED CORE)
        const match = {
            id: crypto.randomUUID(),
            queue: queueName,
            createdAt: new Date(),
            blueCorner,
            redCorner
        };

        // 🥊 SPRINT 19 STEP 1 ADDITION (UI READY PAYLOAD)
        match.ui = {
            buttons: {
                blue: `match_win_blue_${match.id}`,
                red: `match_win_red_${match.id}`
            }
        };

        return match;
    }

    getQueueSize(queueName) {

        const queue = this.queueManager.getQueue(queueName);

        if (!queue) return 0;

        return queue.players.length;
    }
}

module.exports = MatchmakingEngine;