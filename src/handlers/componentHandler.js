module.exports = async (interaction) => {

    if (interaction.isStringSelectMenu()) {

        switch (interaction.customId) {

            case "panel_select":
                return require("../components/panelSelect")(interaction);

        }

    }

    if (interaction.isButton()) {

        switch (interaction.customId) {

            case "join_ranked":
            case "leave_queue":
                return require("../components/rankedButtons")(interaction);

        }

    }

};