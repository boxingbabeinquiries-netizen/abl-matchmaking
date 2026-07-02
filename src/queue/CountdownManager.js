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

        const duration = config.queue[queueName].countdownSeconds;

        let remaining = duration;
        let running = false;

        console.log(
            `⏳ [${queueName}] Countdown started (${duration}s)`
        );

        const interval = setInterval(async () => {

            if (running) {
                return;
            }

            running = true;

            try {

                remaining--;

                await callback(remaining);

                if (remaining <= 0) {

                    console.log(
                        `🥊 [${queueName}] Countdown finished`
                    );

                    this.stop(queueName);
                }

            } finally {

                running = false;

            }

        }, 1000);

        this.timers.set(queueName, {
            interval,
            duration,
            startedAt: Date.now()
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

        console.log(
            `🛑 [${queueName}] Countdown stopped`
        );

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
        return this.stop(queueName);
    }

}

module.exports = new CountdownManager();