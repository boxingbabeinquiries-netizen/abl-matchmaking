const queueManager = require("../queue/queueManager");
const { updateRankedPanel } = require("../ui/updateRankedPanel");
const { QUEUES } = require("./constants");

async function refreshRankedPanel(queueName = QUEUES.RANKED) {

    const queue = queueManager.getQueue(queueName);

    if (!queue) {
        console.error(`Queue "${queueName}" not found.`);
        return;
    }

    if (!queue.panelMessage) {
        return;
    }

    try {

        const updatedPanel = updateRankedPanel(queue);

        await queue.panelMessage.edit(updatedPanel);

    } catch (error) {

        console.error(
            `Failed to refresh "${queueName}" queue panel:`
        );

        console.error(error);

    }

}

module.exports = {
    refreshRankedPanel
};