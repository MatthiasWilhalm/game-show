const GameQueueModScreen = props => {

    const game = props.eventData?.games[props.eventStatus?.gameStatus?.findIndex(g => g.current)];
    const state = props.eventStatus?.gameStatus?.find(g => g.current);


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
                        <li>
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

export default GameQueueModScreen