const queueManager = require("../queue/queueManager");

/**
 * Refreshes a queue panel safely for BOTH legacy and multi-game systems
 */
async function refreshRankedPanel(game, queueName) {

    try {

        //
        // Backward compatibility:
        // If only queueName is passed, default to boxing_beta
        //
        if (!queueName) {
            queueName = game;
            game = "boxing_beta";
        }

        const queue = queueManager.getQueue(game, queueName);

        if (!queue || !queue.panelMessage) {
            return;
        }

        //
        // Build updated panel (existing UI unchanged)
        //
        const players = queue.players || [];

        const content =
`🥊 **QUEUE STATUS**

🎮 Game: ${game === "boxing_beta"
    ? "Boxing Beta"
    : "Untitled Boxing Game"}

📦 Queue: ${queueName}

👥 Players: ${players.length}

${players.length > 0
    ? players.map(p => `• ${p.displayName}`).join("\n")
    : "No fighters in queue yet."}
`;

        await queue.panelMessage.edit({
            content
        });

    } catch (error) {

        console.error("❌ Failed to refresh panel:");
        console.error(error);

    }

}

module.exports = { refreshRankedPanel };