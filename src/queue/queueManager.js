class QueueManager {

    constructor() {

        this.queues = {
            boxing_beta: this.createGameQueues(),
            ubg: this.createGameQueues()
        };

    }

    //
    // Creates the standard queue structure per game
    //
    createGameQueues() {

        return {
            ranked: {
                players: [],
                countdown: null,
                panelMessage: null
            },
            rp: {
                players: [],
                countdown: null,
                panelMessage: null
            }
        };

    }

    //
    // Get a specific queue inside a game
    //
    getQueue(game, queueName) {

        if (!this.queues[game]) {
            return null;
        }

        return this.queues[game][queueName];
    }

    //
    // Add player to a game + queue
    //
    addPlayer(game, queueName, player) {

        const queue = this.getQueue(game, queueName);

        if (!queue) return;

        queue.players.push(player);
    }

    //
    // Remove player from a game + queue
    //
    removePlayer(game, queueName, playerId) {

        const queue = this.getQueue(game, queueName);

        if (!queue) return;

        queue.players = queue.players.filter(
            p => p.id !== playerId
        );
    }

    //
    // Get all players in a queue
    //
    getPlayers(game, queueName) {

        const queue = this.getQueue(game, queueName);

        return queue ? queue.players : [];
    }

    //
    // Set countdown
    //
    setCountdown(game, queueName, value) {

        const queue = this.getQueue(game, queueName);

        if (!queue) return;

        queue.countdown = value;
    }

    //
    // Set panel message (IMPORTANT FOR PERSISTENCE)
    //
    setPanelMessage(game, queueName, message) {

        const queue = this.getQueue(game, queueName);

        if (!queue) return;

        queue.panelMessage = message;
    }

    //
    // Get panel message
    //
    getPanelMessage(game, queueName) {

        const queue = this.getQueue(game, queueName);

        return queue ? queue.panelMessage : null;
    }

    //
    // Get full state (useful for debugging / persistence)
    //
    getAll() {
        return this.queues;
    }

}

module.exports = new QueueManager();