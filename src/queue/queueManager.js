class QueueManager {
    constructor() {
        this.queues = {
            ranked: {
                players: [],
                countdown: null,
                panelMessageId: null
            },
            rp: {
                players: [],
                countdown: null,
                panelMessageId: null
            }
        };
    }

    getQueue(queueName) {
        return this.queues[queueName];
    }

    getPlayers(queueName) {
        return this.queues[queueName].players;
    }

    join(queueName, user) {
        const queue = this.queues[queueName];

        if (!queue) {
            throw new Error(`Queue "${queueName}" does not exist.`);
        }

        const alreadyQueued = queue.players.some(
            player => player.id === user.id
        );

        if (alreadyQueued) {
            return false;
        }

        queue.players.push({
            id: user.id,
            username: user.username
        });

        return true;
    }

    leave(queueName, userId) {
        const queue = this.queues[queueName];

        if (!queue) {
            throw new Error(`Queue "${queueName}" does not exist.`);
        }

        const index = queue.players.findIndex(
            player => player.id === userId
        );

        if (index === -1) {
            return false;
        }

        queue.players.splice(index, 1);

        return true;
    }

    clear(queueName) {
        const queue = this.queues[queueName];

        if (!queue) {
            throw new Error(`Queue "${queueName}" does not exist.`);
        }

        queue.players = [];
        queue.countdown = null;
    }
}

module.exports = new QueueManager();