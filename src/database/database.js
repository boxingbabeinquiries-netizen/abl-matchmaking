const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const databaseFolder = path.join(__dirname, "../../data");

if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder, { recursive: true });
}

const database = new sqlite3.Database(
    path.join(databaseFolder, "commissioner.db"),
    (error) => {

        if (error) {

            console.error("❌ Failed to connect to SQLite.");
            console.error(error);

            return;
        }

        console.log("💾 Connected to Commissioner database.");

    }
);

database.serialize(() => {

    database.run(`
        CREATE TABLE IF NOT EXISTS players (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            displayName TEXT NOT NULL,
            elo INTEGER DEFAULT 1000,
            wins INTEGER DEFAULT 0,
            losses INTEGER DEFAULT 0,
            draws INTEGER DEFAULT 0
        )
    `);

    database.run(`
        CREATE TABLE IF NOT EXISTS queue_players (
            queueName TEXT NOT NULL,
            playerId TEXT NOT NULL,
            joinedAt INTEGER NOT NULL,
            PRIMARY KEY (queueName, playerId)
        )
    `);

});

module.exports = database;