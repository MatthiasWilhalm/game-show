class HintGame {
    constructor(skipAfterOneTry, rounds) {
        this.skipAfterOneTry = skipAfterOneTry;
        this.rounds = rounds;
        this.played = false;
    }
}

class HintGameRounds {
    constructor(hints, answer) {
        this.hints = hints;
        this.answer = answer;
        this.isCurrent = false;
        this.winner = null;
    }
}

class HintGameHint {
    constructor(text, url, urlType) {
        this.text = text;
        this.url = url;
        this.urlType = urlType;
        this.visible = false;
    }
}

module.exports.HintGame = (skipAfterOneTry, rounds) => {
    return new HintGame(skipAfterOneTry, rounds);
}

module.exports.HintGameRounds = (hints, answer) => {
    return new HintGameRounds(hints, answer);
}

module.exports.HintGameHint = (text, url, urlType) => {
    return new HintGameHint(text, url, urlType);
}