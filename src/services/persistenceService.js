const queueManager = require("../queue/queueManager");
const queueRepository = require("../database/queueRepository");
const playerRepository = require("../database/playerRepository");
const Player = require("../models/Player");

class PersistenceService {

    /**
     * Restores every persisted queue into memory.
     */
    async restoreQueues() {

        console.log("💾 Restoring persisted queues...");

        const queueEntries = await queueRepository.getAllQueues();

        if (!queueEntries.length) {

            console.log("📭 No persisted queue data found.");

            return;

        }

        // Group database rows by queue.
        const groupedQueues = {};

        for (const entry of queueEntries) {

            if (!groupedQueues[entry.queueName]) {
                groupedQueues[entry.queueName] = [];
            }

            groupedQueues[entry.queueName].push(entry);

        }

        // Restore each queue.
        for (const [queueName, entries] of Object.entries(groupedQueues)) {

            const queue = queueManager.getQueue(queueName);

            if (!queue) {
                continue;
            }

            const players = await playerRepository.getMany(
                entries.map(entry => entry.playerId)
            );

            // Preserve original queue order.
            const orderedPlayers = entries
                .map(entry =>
                    players.find(player => player.id === entry.playerId)
                )
                .filter(Boolean);

            queue.players = orderedPlayers.map(player => {

                const restoredPlayer = Object.create(Player.prototype);

                Object.assign(restoredPlayer, player);

                restoredPlayer.inQueue = true;
                restoredPlayer.queueName = queueName;

                return restoredPlayer;

            });

            console.log(
                `✅ Restored ${queue.players.length} player(s) into "${queueName}".`
            );

        }

    }

}

module.exports = new PersistenceService();