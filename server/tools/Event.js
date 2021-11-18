const { Game } = require('./Game.js');

/**
 * 
 * @param {String} title 
 * @param {Array<Game>} games 
 */
class Event {
    constructor(title, games) {
        this.title = title;
        this.games = games;
        this.globalScores = new Map();
    }
}

module.exports.Event = (title, games) => {
    return new Event(title, games);
}