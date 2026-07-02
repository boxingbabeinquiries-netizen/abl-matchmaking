const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const databasePath = path.join(__dirname, "../../commissioner.db");

const database = new sqlite3.Database(databasePath, (error) => {

    if (error) {
        console.error("❌ Failed to connect to Commissioner database.");
        console.error(error);
        return;
    }

    console.log("💾 Connected to Commissioner database.");

});

database.serialize(() => {

    //
    // Players
    //
    database.run(`
        CREATE TABLE IF NOT EXISTS players (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            displayName TEXT NOT NULL,
            elo INTEGER NOT NULL,
            wins INTEGER NOT NULL,
            losses INTEGER NOT NULL,
            draws INTEGER NOT NULL
        )
    `);

    //
    // Queue Players
    //
    database.run(`
        CREATE TABLE IF NOT EXISTS queue_players (
            queueName TEXT NOT NULL,
            playerId TEXT NOT NULL,
            joinedAt INTEGER NOT NULL,
            PRIMARY KEY (queueName, playerId)
        )
    `);

    //
    // Queue Panels
    //
    database.run(`
        CREATE TABLE IF NOT EXISTS queue_panels (
            queueName TEXT PRIMARY KEY,
            channelId TEXT NOT NULL,
            messageId TEXT NOT NULL,
            createdAt INTEGER NOT NULL
        )
    `);

    //
    // Matches
    //
    database.run(`
        CREATE TABLE IF NOT EXISTS matches (
            id TEXT PRIMARY KEY,
            queueName TEXT NOT NULL,

            bluePlayerId TEXT NOT NULL,
            redPlayerId TEXT NOT NULL,

            winnerPlayerId TEXT,
            loserPlayerId TEXT,

            status TEXT NOT NULL,

            reportedBy TEXT,

            createdAt INTEGER NOT NULL,
            completedAt INTEGER
        )
    `);

});

module.exports = database;