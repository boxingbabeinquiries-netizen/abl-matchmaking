module.exports = async (interaction) => {

    // SELECT MENUS
    if (interaction.isStringSelectMenu()) {

        switch (interaction.customId) {

            case "panel_select":
                return require("../components/panelSelect")(interaction);

        }

    }

    // BUTTONS
    if (interaction.isButton()) {

        const customId = interaction.customId;

        // Existing ranked system buttons
        switch (customId) {

            case "join_ranked":
            case "leave_queue":
                return require("../components/rankedButtons")(interaction);

        }

        // 🥊 NEW: Match result buttons (Sprint 19)
        if (customId.startsWith("match:")) {
            return require("../components/resultButtons")(interaction);
        }

    }

};