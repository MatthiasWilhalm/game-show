const GameQueueModScreen = props => {

    const game = props.eventData?.games[props.eventStatus?.gameStatus?.findIndex(g => g.current)];
    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);

    const setupRoundStatus = roundId => {
        let ngs = gameState.roundStatus;
        ngs.push({roundId: roundId, hints: [], current: true});
        let ret = props.eventStatus;
        ret.gameStatus.find(g => g.current).roundStatus = ngs;
        props.send('seteventstatus', ret);
    }

    const isLocked = roundId => {
        return !!gameState.roundStatus.find(a => a.roundId === roundId);
    }

    const isInRound = () => {
        return !!gameState.roundStatus.find(a => a.current);
    }

    const getCurrentRoundId = () => {
        return gameState.roundStatus.find(a => a.current)?.roundId;
    }

    const getCurrentRound = () => {
        return game.content.rounds[getCurrentRoundId()];
    }

    const openHint = hintId => {
        let ngs = gameState.roundStatus;
        if(!isHintLocked(hintId)) {
            ngs.find(i => i.roundId === getCurrentRoundId()).hints.push(hintId);
            let ret = props.eventStatus;
            ret.gameStatus.find(g => g.current).roundStatus = ngs;
            props.send('seteventstatus', ret);
        }
    }

    const isHintLocked = hintId => {
        return gameState.roundStatus.find(a => a.current)?.hints.includes(hintId);
    }

    const renderRoundSelectScreen = () => {
        return (
            <div className="lobby-mod-grid">
                <div className="game-title">
                    <h1>
                        {game.title}
                    </h1>
                </div>
                <div></div>
                <div className="double panel centered-panel clickable-list">
                    <ul className="large-list">
                        {game.content?.rounds?.map((a, i) => 
                            <li onClick={() => setupRoundStatus(i)} className={isLocked(i)?'locked':''}>
                                <div>{a.answer}</div>
                                <div></div>
                                <div>{a.hints.length+" hints"}</div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }

    const renderHintSelectScreen = () => {
        return (
            <div className="lobby-mod-grid">
                <div className="game-title">
                    <h1>
                        {game.title}
                    </h1>
                </div>
                <div></div>
                <div className="double panel centered-panel clickable-list">
                    <ul className="large-list">
                        {getCurrentRound()?.hints?.map((a, i) => 
                            <li onClick={() => openHint(i)} className={isHintLocked(i)?"locked":""}>
                                <div>{a.text}</div>
                                <div></div>
                                <div></div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div>
            {isInRound()?
                renderHintSelectScreen()
            :
                renderRoundSelectScreen()                
            }
        </div>
    );
}

export default GameQueueModScreen