const config = require("../config/config");

class CountdownManager {

    constructor() {
        this.timers = new Map();
    }

    isRunning(queueName) {
        return this.timers.has(queueName);
    }

    start(queueName, callback) {

        if (this.isRunning(queueName)) {
            return false;
        }

        let remaining = config.queue[queueName].countdownSeconds;

        const interval = setInterval(async () => {

            remaining--;

            await callback(remaining);

            if (remaining <= 0) {
                this.stop(queueName);
            }

        }, 1000);

        this.timers.set(queueName, {
            interval,
            startedAt: Date.now(),
            duration: config.queue[queueName].countdownSeconds
        });

        return true;
    }

    stop(queueName) {

        const timer = this.timers.get(queueName);

        if (!timer) {
            return false;
        }

        clearInterval(timer.interval);

        this.timers.delete(queueName);

        return true;
    }

    getRemaining(queueName) {

        const timer = this.timers.get(queueName);

        if (!timer) {
            return null;
        }

        const elapsed = Math.floor(
            (Date.now() - timer.startedAt) / 1000
        );

        return Math.max(
            timer.duration - elapsed,
            0
        );
    }

    reset(queueName) {
        this.stop(queueName);
    }

}

module.exports = new CountdownManager();