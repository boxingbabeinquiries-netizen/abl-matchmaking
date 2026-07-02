const config = require("../config/config");
const Player = require("../models/Player");

class QueueManager {

    constructor() {
        this.queues = {
            ranked: this.createQueue(),
            rp: this.createQueue()
        };
    }

    createQueue() {
        return {
            players: [],
            countdown: null,
            panelMessageId: null,
            panelChannelId: null,
            panelMessage: null
        };
    }

    getQueue(queueName) {
        return this.queues[queueName];
    }

    getPlayers(queueName) {
        return this.queues[queueName].players;
    }

    setPanelMessage(queueName, message) {
        const queue = this.getQueue(queueName);

        queue.panelMessage = message;
        queue.panelMessageId = message.id;
        queue.panelChannelId = message.channel.id;
    }

    isPlayerQueued(userId) {
        return Object.values(this.queues).some(queue =>
            queue.players.some(player => player.id === userId)
        );
    }

    join(queueName, member) {

        const queue = this.getQueue(queueName);

        if (!queue) {
            throw new Error(`Queue "${queueName}" does not exist.`);
        }

        if (this.isPlayerQueued(member.id)) {
            return {
                success: false,
                reason: "ALREADY_IN_QUEUE"
            };
        }

        const maxPlayers = config.queue[queueName].maxPlayers;

        if (queue.players.length >= maxPlayers) {
            return {
                success: false,
                reason: "QUEUE_FULL"
            };
        }

        queue.players.push(
            new Player(member)
        );

        return {
            success: true
        };
    }

    leave(queueName, userId) {

        const queue = this.getQueue(queueName);

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

        const queue = this.getQueue(queueName);

        if (!queue) {
            throw new Error(`Queue "${queueName}" does not exist.`);
        }

        queue.players = [];
        queue.countdown = null;
    }

}

module.exports = new QueueManager();