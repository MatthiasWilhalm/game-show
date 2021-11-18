/**
 * 
 * @param {String} title 
 * @param {String} description 
 * @param {String} type 
 * @param {Boolean} useTeams 
 * @param {Object} content 
 */
class Game {
    constructor(title, description, type, useTeams, content) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.useTeams = useTeams;
        this.content = content;
        this.playerProgress = new Map();
        this.teams = [];
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

module.exports.Game = (title, description, type, useTeams, content) => {
    return new Game(title, description, type, useTeams, content);
}

module.exports.PlayerProgress = (score, team, special) => {
    return new PlayerProgress(score, team, special);
}