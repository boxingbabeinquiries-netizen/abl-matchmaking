const queueManager = require("../queue/queueManager");
const { updateRankedPanel } = require("../ui/updateRankedPanel");

async function refreshRankedPanel() {

    const queue = queueManager.getQueue("ranked");

    if (!queue.panelMessage) {
        return;
    }

    await queue.panelMessage.edit(
        updateRankedPanel(queue)
    );
}

module.exports = {
    refreshRankedPanel
};