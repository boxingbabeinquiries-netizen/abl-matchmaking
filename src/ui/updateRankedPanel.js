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

    let matchmakingText = "Waiting for another fighter...";

    if (queue.countdown !== null) {

        const minutes = Math.floor(queue.countdown / 60);
        const seconds = queue.countdown % 60;

        matchmakingText =
            `🔔 Match begins in\n\n` +
            `**${minutes.toString().padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}**`;

    } else if (queue.players.length >= 2) {

        matchmakingText = "Preparing matchmaking...";

    }

    embed.spliceFields(
        2,
        1,
        {
            name: "⏳ Matchmaking",
            value: matchmakingText,
            inline: false
        }
    );

    return panel;

}

module.exports = {
    updateRankedPanel
};