const queueManager = require("../queue/queueManager");

module.exports = async (interaction) => {

    switch (interaction.customId) {

        case "join_ranked": {

            const joined = queueManager.join("ranked", interaction.user);

            if (!joined) {
                return interaction.reply({
                    content: "❌ You are already in the Ranked Queue.",
                    ephemeral: true
                });
            }

            const players = queueManager.getPlayers("ranked");

            return interaction.reply({
                content:
                    `🥊 You joined the Ranked Queue!\n\n` +
                    `👥 Fighters waiting: **${players.length}**`,
                ephemeral: true
            });
        }

        case "leave_queue": {

            const left = queueManager.leave("ranked", interaction.user.id);

            if (!left) {
                return interaction.reply({
                    content: "❌ You aren't currently in the Ranked Queue.",
                    ephemeral: true
                });
            }

            const players = queueManager.getPlayers("ranked");

            return interaction.reply({
                content:
                    `🚪 You left the Ranked Queue.\n\n` +
                    `👥 Fighters waiting: **${players.length}**`,
                ephemeral: true
            });
        }

    }

};