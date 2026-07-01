const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("../config/config");
const { BUTTONS } = require("../utils/constants");

function createRankedPanel() {

    const embed = new EmbedBuilder()
        .setColor(0xD62828)
        .setTitle("🥊 Animal Boxing League")
        .setDescription("## Ranked Matchmaking")
        .addFields(
            {
                name: "🟢 Status",
                value: "Open",
                inline: false
            },
            {
                name: `👥 Fighters Waiting (0/${config.queue.ranked.maxPlayers})`,
                value: "No fighters waiting.",
                inline: false
            },
            {
                name: "⏳ Matchmaking",
                value: "Waiting for another fighter...",
                inline: false
            }
        )
        .setFooter({
            text: "Animal Boxing League • Ranked Queue"
        })
        .setTimestamp();

    const buttons = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId(BUTTONS.JOIN_RANKED)
                .setLabel("Join Ranked")
                .setEmoji("🥊")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId(BUTTONS.LEAVE_QUEUE)
                .setLabel("Leave Queue")
                .setEmoji("🚪")
                .setStyle(ButtonStyle.Secondary)

        );

    return {
        embeds: [embed],
        components: [buttons]
    };
}

module.exports = {
    createRankedPanel
};