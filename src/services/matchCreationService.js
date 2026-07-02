const queueManager = require("../queue/queueManager");
const MatchmakingEngine = require("../queue/matchmakingEngine");
const { createMatchAnnouncement } = require("../ui/matchAnnouncement");
const { refreshRankedPanel } = require("../utils/refreshRankedPanel");

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

        console.log("Blue Player:");
        console.dir(match.blueCorner, { depth: null });

        console.log("Red Player:");
        console.dir(match.redCorner, { depth: null });

        const queue = queueManager.getQueue(queueName);
        queue.countdown = null;

        const announcement = createMatchAnnouncement(match);

        const payload = {
            content:
`🚨 **MATCH FOUND!** 🚨

🥊 The Commissioner has sanctioned a ranked bout!

🔵 <@${match.blueCorner.id}>
🔴 <@${match.redCorner.id}>`,
            embeds: announcement.embeds,
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