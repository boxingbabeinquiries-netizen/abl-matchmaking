const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

function createRankedPanel() {
    const embed = new EmbedBuilder()
        .setColor(0xE53935)
        .setTitle("🥊 Animal Boxing League")
        .setDescription("## Ranked Matchmaking")
        .addFields(
            {
                name: "🟢 Status",
                value: "Open",
                inline: false
            },
            {
                name: "👥 Fighters Waiting",
                value: "No fighters waiting.",
                inline: false
            },
            {
                name: "⏳ Next Matchmaking",
                value: "Waiting for fighters...",
                inline: false
            }
        )
        .setFooter({
            text: "Animal Boxing League • Ranked Queue"
        })
        .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("join_ranked")
            .setLabel("🥊 Join Ranked")
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId("leave_queue")
            .setLabel("🚪 Leave Queue")
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