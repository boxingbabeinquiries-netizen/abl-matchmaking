const queueManager = require("../queue/queueManager");
const MatchmakingEngine = require("../queue/matchmakingEngine");
const { createMatchAnnouncement } = require("../ui/matchAnnouncement");
const { refreshRankedPanel } = require("../utils/refreshRankedPanel");

const RESULT_CHANNELS = {
    "1522239844376383498": "1521881655441362974", // UBG results
    "1522239909946068994": "1522218916292595804"  // BB results
};

// 🆕 MATCHMAKING CHANNEL ROUTING (STEP 2 FIX)
const MATCH_CHANNELS = {
    "1522239844376383498": "1522276358007423206", // UBG matchmaking
    "1522239909946068994": "1522276383823364226"  // BB matchmaking
};

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// 🧠 SHARED MATCH STORE
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

        // 🧠 STORE MATCH FOR BUTTON HANDLER
        activeMatches.set(match.id, match);

        // 🥊 BUTTONS
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

        try {

            // 🥊 STEP 2 FIX — ROUTE TO MATCHMAKING CHANNEL
            const matchChannelId = MATCH_CHANNELS[channel.id];

            const matchChannel = channel.guild.channels.cache.get(matchChannelId);

            if (!matchChannel) {
                console.error("❌ Matchmaking channel not found.");
                return;
            }

            await matchChannel.send(payload);

            console.log(
                `🥊 Match created in matchmaking channel: ${match.blueCorner.displayName} vs ${match.redCorner.displayName}`
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