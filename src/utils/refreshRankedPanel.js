const queueManager = require("../queue/queueManager");
const { updateRankedPanel } = require("../ui/updateRankedPanel");
const { QUEUES } = require("./constants");

async function refreshRankedPanel(queueName = QUEUES.RANKED) {

    const queue = queueManager.getQueue(queueName);

    if (!queue) {
        console.error(`Queue "${queueName}" not found.`);
        return false;
    }

    if (!queue.panelMessage) {
        return false;
    }

    try {

        const updatedPanel = updateRankedPanel(queue);

        await queue.panelMessage.edit(updatedPanel);

        return true;

    } catch (error) {

        console.error(
            `Failed to refresh "${queueName}" queue panel:`
        );

        console.error(error);

        // If the panel was deleted, clear the cached reference.
        queue.panelMessage = null;
        queue.panelMessageId = null;
        queue.panelChannelId = null;

        return false;

    }

}

module.exports = {
    refreshRankedPanel
};