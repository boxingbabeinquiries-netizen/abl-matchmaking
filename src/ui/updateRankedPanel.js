const { createRankedPanel } = require("./rankedPanel");

function updateRankedPanel(queue) {

    const panel = createRankedPanel();

    const embed = panel.embeds[0];

    const fighterList =
        queue.players.length === 0
            ? "No fighters waiting."
            : queue.players
                  .map(player => `🥊 ${player.username}`)
                  .join("\n");

    embed.spliceFields(
        1,
        1,
        {
            name: "👥 Fighters Waiting",
            value: fighterList,
            inline: false
        }
    );

    return panel;
}

module.exports = {
    updateRankedPanel
};