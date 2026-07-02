const matchRepository = require("../database/matchRepository");
const matchResolutionService = require("../services/matchResolutionService");

module.exports = async (interaction) => {

    try {

        const parts = interaction.customId.split(":");

        if (parts.length !== 3) {
            return;
        }

        const [, matchId, winnerCorner] = parts;

        const match = await matchRepository.get(matchId);

        if (!match) {

            return interaction.reply({
                content: "❌ This match could not be found.",
                ephemeral: true
            });

        }

        if (match.status === "COMPLETE") {

            return interaction.reply({
                content: "❌ This match has already been finalized.",
                ephemeral: true
            });

        }

        const userId = interaction.user.id;

        if (
            userId !== match.bluePlayerId &&
            userId !== match.redPlayerId
        ) {

            return interaction.reply({
                content: "❌ Only the two competitors may report the result of this bout.",
                ephemeral: true
            });

        }

        const winnerPlayerId =
            winnerCorner === "blue"
                ? match.bluePlayerId
                : match.redPlayerId;

        const loserPlayerId =
            winnerCorner === "blue"
                ? match.redPlayerId
                : match.bluePlayerId;

        await matchResolutionService.completeMatch(
            interaction,
            match,
            winnerPlayerId,
            loserPlayerId
        );

    } catch (error) {

        console.error(error);

        if (!interaction.replied && !interaction.deferred) {

            await interaction.reply({
                content: "❌ An unexpected error occurred.",
                ephemeral: true
            });

        }

    }

};