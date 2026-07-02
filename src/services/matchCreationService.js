const queueManager = require("../queue/queueManager");
const MatchmakingEngine = require("../queue/matchmakingEngine");
const { createMatchAnnouncement } = require("../ui/matchAnnouncement");
const { refreshRankedPanel } = require("../utils/refreshRankedPanel");

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// 🧠 SHARED MATCH STORE (FIX FOR STEP 3 ISSUE)
const { activeMatches } = require("../data/matchStore");

console.log("🔥 NEW matchCreationService LOADED");

const matchmakingEngine = new MatchmakingEngine(queueManager);

class MatchCreationService {

    async create(channel, queueName) {

        console.log(`[${queueName}] Starting match creation...`);

        if (!matchmakingEngine.canCreateMatch(queueName)) {
            console.log(`[${queueName}] Not enough players to create a match.`);
            return null;
        }

        const match = matchmakingEngine.createMatch(queueName);

        if (!match) {
            console.log(`[${queueName}] Matchmaking engine returned null.`);
            return null;
        }

        console.log(
            `[${queueName}] Match selected: ${match.blueCorner.displayName} vs ${match.redCorner.displayName}`
        );

        const queue = queueManager.getQueue(queueName);
        queue.countdown = null;

        const announcement = createMatchAnnouncement(match);

        // 🧠 STEP 2 — STORE MATCH FOR BUTTON HANDLER
        activeMatches.set(match.id, match);

        // 🥊 WINNER BUTTONS
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`match_win_blue_${match.id}`)
                .setLabel(`Blue Corner`)
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId(`match_win_red_${match.id}`)
                .setLabel(`Red Corner`)
                .setStyle(ButtonStyle.Danger)
        );

        const payload = {
            content:
`🚨 **MATCH FOUND!** 🚨

🥊 The Commissioner has sanctioned a ranked bout!

🔵 <@${match.blueCorner.id}>
🔴 <@${match.redCorner.id}>

👉 Select the winner below:`,

            embeds: announcement.embeds,

            components: [row],

            allowedMentions: {
                parse: ["users"]
            }
        };

        console.log("Sending payload:");
        console.dir(payload, { depth: null });

        try {

            await channel.send(payload);

            console.log(
                `🥊 Match created: ${match.blueCorner.displayName} vs ${match.redCorner.displayName}`
            );

        } catch (error) {

            console.error("Failed to announce match:");
            console.error(error);

        }

        await refreshRankedPanel(queueName);

        console.log(`[${queueName}] Match creation complete.`);

        return match;

    }

}

module.exports = new MatchCreationService();