const { EmbedBuilder } = require("discord.js");

function createMatchAnnouncement(match) {

    return {
        embeds: [
            new EmbedBuilder()
                .setColor(0xD62828)
                .setTitle("🥊 THE COMMISSIONER")
                .setDescription("## A Ranked Bout Has Been Sanctioned!")
                .addFields(
                    {
                        name: "🔵 Blue Corner",
                        value: `🥊 ${match.blueCorner.displayName}`,
                        inline: true
                    },
                    {
                        name: "🔴 Red Corner",
                        value: `🥊 ${match.redCorner.displayName}`,
                        inline: true
                    },
                    {
                        name: "📋 Division",
                        value: "Ranked Queue",
                        inline: false
                    }
                )
                .setFooter({
                    text: "Animal Boxing League • Fight sanctioned by The Commissioner"
                })
                .setTimestamp()
        ]
    };

}

module.exports = {
    createMatchAnnouncement
};