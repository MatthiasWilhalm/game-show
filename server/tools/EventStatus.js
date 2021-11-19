/**
 * @param{String} modId
 */
class EventStatus {
    constructor(modId) {
        this.modId = modId;
        this.globalScores = new Map();
        this.gameStatus = new Map(); // gameId, GameStatus
    }
}

/**
 * @param{Array<String>} teams
 */
class GameStatus {
    constructor(teams) {
        this.current = false;
        this.done = false;
        this.teams = teams || [];
        this.playerProgress = new Map(); // playerId, PlayerProgress
        this.roundStatus = [];
    }
}

/**
 * 
 * @param {Number} score 
 * @param {Number} team 
 * @param {Number} special 
 */
 class PlayerProgress {
    constructor(score, team, special) {
        this.score = score;
        this.team = team;
        this.special = special;
    }
}

module.exports.EventStatus = (modId) => {
    return new EventStatus(modId);
}

module.exports.GameStatus = (teams) => {
    return new GameStatus(teams);
}

module.exports.PlayerProgress = (score, team, special) => {
    return new PlayerProgress(score, team, special);
}