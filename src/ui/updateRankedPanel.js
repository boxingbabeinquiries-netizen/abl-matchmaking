const config = require("../config/config");
const { createRankedPanel } = require("./rankedPanel");

function formatCountdown(seconds) {

    if (seconds === null || seconds === undefined) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;

}

function updateRankedPanel(queue) {

    const panel = createRankedPanel();
    const embed = panel.embeds[0];

    const maxPlayers = config.queue.ranked.maxPlayers;

    const fighterList =
        queue.players.length === 0
            ? "*No fighters waiting.*"
            : queue.players
                .map(player => `🥊 ${player.displayName}`)
                .join("\n");

    let status = "🟢 Waiting for Fighters";
    let matchmaking = "Waiting for another fighter...";

    if (queue.countdown !== null) {

        status = "🟡 Countdown Active";

        matchmaking =
            `🔔 Match begins in\n\n**${formatCountdown(queue.countdown)}**`;

    }
    else if (queue.players.length >= 2) {

        status = "🟠 Ready";

        matchmaking =
            "Two fighters are ready.\nCountdown will begin shortly.";

    }

    embed.spliceFields(
        0,
        3,
        {
            name: "📊 Queue Status",
            value: status,
            inline: false
        },
        {
            name: `👥 Fighters Waiting (${queue.players.length}/${maxPlayers})`,
            value: fighterList,
            inline: false
        },
        {
            name: "⏳ Matchmaking",
            value: matchmaking,
            inline: false
        }
    );

    return panel;

}

module.exports = {
    updateRankedPanel
};