const database = require("./database");

class QueueRepository {

    async addPlayer(queueName, player) {

        return new Promise((resolve, reject) => {

            database.run(
                `
                INSERT OR REPLACE INTO queue_players (
                    queueName,
                    playerId,
                    joinedAt
                )
                VALUES (?, ?, ?)
                `,
                [
                    queueName,
                    player.id,
                    player.joinedAt
                ],
                function (error) {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();

                }
            );

        });

    }

    async removePlayer(queueName, playerId) {

        return new Promise((resolve, reject) => {

            database.run(
                `
                DELETE FROM queue_players
                WHERE queueName = ?
                AND playerId = ?
                `,
                [
                    queueName,
                    playerId
                ],
                function (error) {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();

                }
            );

        });

    }

    async clearQueue(queueName) {

        return new Promise((resolve, reject) => {

            database.run(
                `
                DELETE FROM queue_players
                WHERE queueName = ?
                `,
                [
                    queueName
                ],
                function (error) {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();

                }
            );

        });

    }

    async getPlayers(queueName) {

        return new Promise((resolve, reject) => {

            database.all(
                `
                SELECT *
                FROM queue_players
                WHERE queueName = ?
                ORDER BY joinedAt ASC
                `,
                [
                    queueName
                ],
                (error, rows) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(rows);

                }
            );

        });

    }

    /**
     * Returns every persisted queue entry.
     */
    async getAllQueues() {

        return new Promise((resolve, reject) => {

            database.all(
                `
                SELECT *
                FROM queue_players
                ORDER BY queueName ASC, joinedAt ASC
                `,
                [],
                (error, rows) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(rows);

                }
            );

        });

    }

    /**
     * Returns true if a queue contains persisted players.
     */
    async hasPlayers(queueName) {

        const players = await this.getPlayers(queueName);

        return players.length > 0;

    }

}

module.exports = new QueueRepository();