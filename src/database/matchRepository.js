const database = require("./database");
const crypto = require("crypto");

class MatchRepository {

    async create(queueName, bluePlayerId, redPlayerId) {

        const id = crypto.randomUUID();

        const match = {
            id,
            queueName,
            bluePlayerId,
            redPlayerId,
            winnerPlayerId: null,
            loserPlayerId: null,
            status: "PENDING",
            reportedBy: null,
            createdAt: Date.now(),
            completedAt: null
        };

        return new Promise((resolve, reject) => {

            database.run(
                `
                INSERT INTO matches (
                    id,
                    queueName,
                    bluePlayerId,
                    redPlayerId,
                    winnerPlayerId,
                    loserPlayerId,
                    status,
                    reportedBy,
                    createdAt,
                    completedAt
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    match.id,
                    match.queueName,
                    match.bluePlayerId,
                    match.redPlayerId,
                    match.winnerPlayerId,
                    match.loserPlayerId,
                    match.status,
                    match.reportedBy,
                    match.createdAt,
                    match.completedAt
                ],
                function (error) {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(match);

                }
            );

        });

    }

    async get(matchId) {

        return new Promise((resolve, reject) => {

            database.get(
                `
                SELECT *
                FROM matches
                WHERE id = ?
                `,
                [matchId],
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

    async complete(matchId, winnerPlayerId, loserPlayerId, reportedBy) {

        return new Promise((resolve, reject) => {

            database.run(
                `
                UPDATE matches
                SET
                    winnerPlayerId = ?,
                    loserPlayerId = ?,
                    reportedBy = ?,
                    status = 'COMPLETE',
                    completedAt = ?
                WHERE id = ?
                `,
                [
                    winnerPlayerId,
                    loserPlayerId,
                    reportedBy,
                    Date.now(),
                    matchId
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

    async getPending() {

        return new Promise((resolve, reject) => {

            database.all(
                `
                SELECT *
                FROM matches
                WHERE status = 'PENDING'
                ORDER BY createdAt ASC
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

}

module.exports = new MatchRepository();