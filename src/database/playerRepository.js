const database = require("./database");

class PlayerRepository {

    async create(player) {

        return new Promise((resolve, reject) => {

            database.run(
                `
                INSERT OR IGNORE INTO players (
                    id,
                    username,
                    displayName,
                    elo,
                    wins,
                    losses,
                    draws
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    player.id,
                    player.username,
                    player.displayName,
                    player.elo,
                    player.wins,
                    player.losses,
                    player.draws
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

    async get(id) {

        return new Promise((resolve, reject) => {

            database.get(
                `
                SELECT *
                FROM players
                WHERE id = ?
                `,
                [id],
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

    async update(player) {

        return new Promise((resolve, reject) => {

            database.run(
                `
                UPDATE players
                SET
                    username = ?,
                    displayName = ?,
                    elo = ?,
                    wins = ?,
                    losses = ?,
                    draws = ?
                WHERE id = ?
                `,
                [
                    player.username,
                    player.displayName,
                    player.elo,
                    player.wins,
                    player.losses,
                    player.draws,
                    player.id
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

}

module.exports = new PlayerRepository();