const database = require("./database");

class QueuePanelRepository {

    async save(queueName, channelId, messageId) {

        return new Promise((resolve, reject) => {

            database.run(
                `
                INSERT INTO queue_panels (
                    queueName,
                    channelId,
                    messageId,
                    createdAt
                )
                VALUES (?, ?, ?, ?)
                ON CONFLICT(queueName)
                DO UPDATE SET
                    channelId = excluded.channelId,
                    messageId = excluded.messageId,
                    createdAt = excluded.createdAt
                `,
                [
                    queueName,
                    channelId,
                    messageId,
                    Date.now()
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

    async get(queueName) {

        return new Promise((resolve, reject) => {

            database.get(
                `
                SELECT *
                FROM queue_panels
                WHERE queueName = ?
                `,
                [queueName],
                (error, row) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(row ?? null);

                }
            );

        });

    }

    async getAll() {

        return new Promise((resolve, reject) => {

            database.all(
                `
                SELECT *
                FROM queue_panels
                ORDER BY queueName ASC
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

    async delete(queueName) {

        return new Promise((resolve, reject) => {

            database.run(
                `
                DELETE
                FROM queue_panels
                WHERE queueName = ?
                `,
                [queueName],
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

}

module.exports = new QueuePanelRepository();