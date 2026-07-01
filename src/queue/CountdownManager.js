class CountdownManager {

    constructor() {
        this.timers = new Map();
    }

    isRunning(queueName) {
        return this.timers.has(queueName);
    }

    start(queueName, interval) {

        if (this.isRunning(queueName)) {
            return false;
        }

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

    get(queueName) {
        return this.timers.get(queueName);
    }

}

module.exports = new CountdownManager();