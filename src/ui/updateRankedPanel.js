const config = require("../config/config");
const { createRankedPanel } = require("./rankedPanel");

function updateRankedPanel(queue) {

    const panel = createRankedPanel();

    const embed = panel.embeds[0];

    const maxPlayers = config.queue.ranked.maxPlayers;

    const fighters =
        queue.players.length === 0
            ? "No fighters waiting."
            : queue.players
                  .map(player => `🥊 ${player.displayName}`)
                  .join("\n");

    embed.spliceFields(
        1,
        1,
        {
            name: `👥 Fighters Waiting (${queue.players.length}/${maxPlayers})`,
            value: fighters,
            inline: false
        }
    );

    embed.spliceFields(
        2,
        1,
        {
            name: "⏳ Matchmaking",
            value:
                queue.players.length >= 2
                    ? "🔔 Matchmaking will begin soon..."
                    : "Waiting for another fighter...",
            inline: false
        }
    );

    return panel;
}

module.exports = {
    updateRankedPanel
};