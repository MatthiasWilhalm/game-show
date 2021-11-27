const GameQueuePlayerScreen = props => {

    const game = props.eventData?.games[props.eventStatus?.gameStatus?.findIndex(g => g.current)];
    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);


    const getCurrentRoundId = () => {
        return gameState.roundStatus.find(a => a.current)?.roundId;
    }

    const getCurrentRound = () => {
        return game.content.rounds[getCurrentRoundId()];
    }

    const getActiveHints = () => {
        let ret = [];
        getCurrentRound()?.hints.forEach((hint, i) => {
            if(gameState.roundStatus.find(a => a.current).hints.includes(i))
                ret.push(hint);
        });
        return ret;
    }

    return (
        <div className="lobby-mod-grid">
            <div className="game-title">
                <h1>
                    {game.title}
                </h1>
            </div>
            <div></div>
            <div className="double panel centered-panel">
                <ul className="large-list">
                    {getActiveHints().map(a => 
                        <li>
                            <div>{a.text}</div>
                            <div></div>
                            <div></div>
                        </li>    
                    )}
                </ul>
            </div>
            <div></div>
            <div className="buzzer">
                <h3>Buzzer</h3>
                <p>(space)</p>
            </div>
        </div>
    );
}

export default GameQueuePlayerScreen