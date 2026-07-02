const panelSelect = require("../components/panelSelect");
const rankedButtons = require("../components/rankedButtons");

const queueManager = require("../queue/queueManager");
const { activeMatches } = require("../data/matchStore");

// 🧠 CHANNEL ROUTING (UBG / BB → RESULT CHANNELS)
const RESULT_CHANNELS = {
    "1522239844376383498": "1521881655441362974", // UBG
    "1522239909946068994": "1522218916292595804"  // BB
};

module.exports = async (interaction) => {

    // 🧠 SELECT MENUS
    if (interaction.isStringSelectMenu()) {

        switch (interaction.customId) {
            case "panel_select":
                return panelSelect(interaction);
        }
    }

    // 🧠 BUTTONS
    if (interaction.isButton()) {

        const customId = interaction.customId;

        // =========================
        // 🥊 SPRINT 18 LOGIC
        // =========================
        switch (customId) {

            case "join_ranked":
            case "leave_queue":
                return rankedButtons(interaction);
        }

        // =========================
        // 🥊 SPRINT 19 MATCH RESULTS
        // =========================

        if (customId.startsWith("match_win_")) {

            const parts = customId.split("_");
            const winnerColor = parts[2]; // blue or red
            const matchId = parts.slice(3).join("_");

            // 🧠 GET MATCH
            const match = activeMatches.get(matchId);

            if (!match) {
                return interaction.reply({
                    content: "❌ Match data not found.",
                    ephemeral: true
                });
            }

            // 🧠 PREVENT DOUBLE RESOLUTION
            if (match.resolved) {
                return interaction.reply({
                    content: "❌ This match already has a result.",
                    ephemeral: true
                });
            }

            // 🧠 STEP 3 — DECIDE WINNER
            match.resolved = true;

            const winnerUser = winnerColor === "blue"
                ? match.blueCorner
                : match.redCorner;

            // 🧠 DATE
            const now = new Date();
            const formattedDate = now.toLocaleString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });

            // 🧠 STEP 4 — ROUTE RESULT CHANNEL (UBG / BB)
            const sourceChannelId = interaction.channelId;
            const resultChannelId = RESULT_CHANNELS[sourceChannelId];

            const resultChannel = interaction.guild.channels.cache.get(resultChannelId);

            if (resultChannel) {

                await resultChannel.send({
                    content:
`🥊 **MATCH RESULT**

🥊 ${match.blueCorner.displayName} vs ${match.redCorner.displayName}
📅 ${formattedDate}
🏆 Winner: ${winnerUser.displayName || winnerUser.username}

Match ID: \`${matchId}\``
                });
            }

            // 🧠 UPDATE MATCH MESSAGE
            await interaction.update({
                content: `🏁 Match concluded. Winner selected: **${winnerColor.toUpperCase()}**`,
                components: []
            });

            // 🧠 CLEANUP AFTER 30s
            setTimeout(async () => {
                try {
                    await interaction.message.delete();
                } catch (e) {}
            }, 30000);

            return;
        }
    }
};