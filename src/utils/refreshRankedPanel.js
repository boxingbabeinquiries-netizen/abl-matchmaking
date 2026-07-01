const queueManager = require("../queue/queueManager");
const { updateRankedPanel } = require("../ui/updateRankedPanel");

async function refreshRankedPanel() {

    const queue = queueManager.getQueue("ranked");

    if (!queue.panelMessage) {
        return;
    }

    try {

        const updatedPanel = updateRankedPanel(queue);

        await queue.panelMessage.edit(updatedPanel);

    } catch (error) {

        console.error("Failed to refresh Ranked Queue panel:");
        console.error(error);

    }

}

module.exports = {
    refreshRankedPanel
};