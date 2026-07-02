const matchRepository = require("../database/matchRepository");
const queueManager = require("../queue/queueManager");
const config = require("../config/config");

class MatchResolutionService {

    async completeMatch(
        interaction,
        match,
        winnerPlayerId,
        loserPlayerId
    ) {

        try {

            //
            // 1. Update match in database
            //
            await matchRepository.complete(
                match.id,
                winnerPlayerId,
                loserPlayerId,
                interaction.user.id
            );

            //
            // 2. Disable buttons in the original message
            //
            const disabledComponents =
                interaction.message.components.map(row => {

                    return {
                        type: row.type,
                        components: row.components.map(button => ({
                            type: button.type,
                            style: button.style,
                            label: button.label,
                            customId: button.customId,
                            disabled: true
                        }))
                    };

                });

            await interaction.message.edit({
                components: disabledComponents
            });

            //
            // 3. Send archive message
            //
            const channel = await interaction.client.channels.fetch(
                config.archive.resultsChannelId
            );

            if (channel) {

                const now = new Date();

                const formattedTime = now.toLocaleString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                });

                await channel.send({

                    content:
`🥊 **OFFICIAL MATCH RESULT**

🏆 Winner: <@${winnerPlayerId}>
💀 Loser: <@${loserPlayerId}>

📊 Queue: ${match.queueName}
🆔 Match ID: ${match.id}

📅 Finished at: ${formattedTime}

⚖️ Reported by: <@${interaction.user.id}>`

                });

            } else {

                console.warn("Archive channel not found.");
            }

            //
            // 4. Confirm
            //
            await interaction.reply({
                content: "🥊 Result recorded and archived successfully!",
                ephemeral: true
            });

            console.log(
                `🥊 Match ${match.id} completed by ${interaction.user.id}`
            );

        } catch (error) {

            console.error("❌ Match resolution failed (REAL ERROR BELOW):");
            console.error(error);
            console.error(error?.stack);

            if (!interaction.replied && !interaction.deferred) {

                await interaction.reply({
                    content: "❌ Failed to record match result.",
                    ephemeral: true
                });

            }

        }

    }

}

module.exports = new MatchResolutionService();