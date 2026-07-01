class MatchmakingEngine {

    constructor(queueManager) {
        this.queueManager = queueManager;
    }

    canCreateMatch(queueName) {

        const players = this.queueManager.getPlayers(queueName);

        return players.length >= 2;
    }

    createMatch(queueName) {

        const players = this.queueManager.getPlayers(queueName);

        if (players.length < 2) {
            return null;
        }

        const fighterOne = players.shift();
        const fighterTwo = players.shift();

        return {
            createdAt: new Date(),
            queue: queueName,
            blueCorner: fighterOne,
            redCorner: fighterTwo
        };
    }

}

module.exports = MatchmakingEngine;