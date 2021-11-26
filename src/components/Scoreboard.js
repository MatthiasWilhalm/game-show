const Scoreboard = props => {

    const renderPlayerItem = a => {
        return (
            <li className="scoreboard-item-player">
                <div>{a.username}</div>
                <div>10</div>
                <div>12</div>
            </li>
        );
    }

    const renderModItem = a => {
        return (
            <li className="scoreboard-item-mod">
                <div>{a.username}</div>
            </li>
        );
    }

    const renderSpectatorItem = a => {
        return (
            <li className="scoreboard-item-spectator">
                <div>{a.username}</div>
            </li>
        );
    }

    return (
        <div className="window-bg">
            {console.log(props.eventPlayerList)}
            <div className="scoreboard">
                <h1>Scoreboard</h1>
                <ul>
                    {props.eventPlayerList?.filter(b => b.playerState === props.PlayerStates.MOD).map(a => 
                        renderModItem(a)
                    )}
                    <div className="list-spacer"></div>
                    {props.eventPlayerList?.filter(b => b.playerState === props.PlayerStates.PLAYER).map(a => 
                        renderPlayerItem(a)
                    )}
                    <div className="list-spacer"></div>
                    {props.eventPlayerList?.filter(b => b.playerState === props.PlayerStates.SPECTATOR).map(a => 
                        renderSpectatorItem(a)
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Scoreboard