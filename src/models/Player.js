class Player {

    constructor(member) {

        this.id = member.id;
        this.username = member.user.username;
        this.displayName = member.displayName;

        this.joinedAt = Date.now();

        // Ranking (future)
        this.elo = 1000;

        // Statistics (future)
        this.wins = 0;
        this.losses = 0;
        this.draws = 0;

        // Matchmaking
        this.inQueue = true;
        this.queueName = null;
    }

    setQueue(queueName) {
        this.queueName = queueName;
        this.inQueue = true;
    }

    leaveQueue() {
        this.queueName = null;
        this.inQueue = false;
    }

    getQueueTime() {
        return Date.now() - this.joinedAt;
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            displayName: this.displayName,
            joinedAt: this.joinedAt,
            elo: this.elo,
            wins: this.wins,
            losses: this.losses,
            draws: this.draws
        };
    }

}

module.exports = Player;