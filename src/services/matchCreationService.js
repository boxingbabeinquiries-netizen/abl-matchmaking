const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const queueManager = require("../queue/queueManager");
const MatchmakingEngine = require("../queue/matchmakingEngine");

const matchRepository = require("../database/matchRepository");

const { createMatchAnnouncement } = require("../ui/matchAnnouncement");
const { refreshRankedPanel } = require("../utils/refreshRankedPanel");

const matchmakingEngine = new MatchmakingEngine(queueManager);

class MatchCreationService {

    async create(channel, game, queueName) {

        if (!matchmakingEngine.canCreateMatch(game, queueName)) {
            return null;
        }

        const match = matchmakingEngine.createMatch(game, queueName);

        if (!match) {
            return null;
        }

        const queue = queueManager.getQueue(game, queueName);
        queue.countdown = null;

        //
        // Persist match WITH game context
        //
        const storedMatch = await matchRepository.create(
            game,
            queueName,
            match.blueCorner.id,
            match.redCorner.id
        );

        const announcement = createMatchAnnouncement(match);

        const buttons = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId(`match:${storedMatch.id}:blue`)
                .setLabel("🟦 Blue Corner Won")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId(`match:${storedMatch.id}:red`)
                .setLabel("🟥 Red Corner Won")
                .setStyle(ButtonStyle.Danger)

        );

        await channel.send({

            content:
`🚨 **MATCH FOUND!** 🚨

🥊 **The Commissioner has sanctioned a ${game === "boxing_beta"
    ? "Boxing Beta"
    : "Untitled Boxing Game"} bout!**

🔵 <@${match.blueCorner.id}>
🆚
🔴 <@${match.redCorner.id}>

Report the result after the fight using the buttons below.`,

            embeds: announcement.embeds,

            components: [buttons],

            allowedMentions: {
                users: [
                    match.blueCorner.id,
                    match.redCorner.id
                ]
            }

        });

        console.log(
            `🥊 Match ${storedMatch.id} created in ${game}/${queueName}`
        );

        await refreshRankedPanel(game, queueName);

        return match;

    }

}

module.exports = new MatchCreationService();