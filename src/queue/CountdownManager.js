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

        let seconds = config.queue[queueName].countdownSeconds;

        const interval = setInterval(async () => {

            seconds--;

            await callback(seconds);

            if (seconds <= 0) {
                clearInterval(interval);
                this.timers.delete(queueName);
            }

        }, 1000);

        this.timers.set(queueName, interval);

        return true;

    }

    stop(queueName) {

        const timer = this.timers.get(queueName);

        if (!timer) {
            return false;
        }

        clearInterval(timer);
        this.timers.delete(queueName);

        return true;

    }

}

module.exports = new CountdownManager();