import MainButton from "./MainButton";

const LobbyModScreen = props => {

    const selectGame = gameId => {
        let es = props.eventStatus;
        if(es?.gameStatus?.[gameId]) {
            if(es.gameStatus[gameId].selected) {
                deselectAllGames();
                es.gameStatus[gameId].selected = false;
            } else {
                deselectAllGames();
                es.gameStatus[gameId].selected = true;
            }
            props.send('seteventstatus', es);
        }
    }

    const deselectAllGames = () => {
        let es = props.eventStatus;
        if(es) {
            es.gameStatus?.forEach(gs => {
                gs.selected = false;
            });
            props.send('seteventstatus', es);
        }
    }

    const startGame = () => {
        let es = props.eventStatus;
        if(getSelectedGame()) {
            es.gameStatus[getSelectedGameIndex()].current = true;
            deselectAllGames();
            props.send('seteventstatus', es);
        }
    }

    const getSelectedGame = () => {
        let id = getSelectedGameIndex();
        if(id!==-1) {
            return props.eventData?.games[id];
        }
        return null;
    }

    const getSelectedGameIndex = () => {
        return props.eventStatus?.gameStatus?.findIndex(g => g.selected);
    }

    return (
        <div className="lobby-mod-grid">
            <div className="game-title">
                <h1>
                    {props.eventData?.title}
                </h1>
            </div>
            <div className="sidepanel panel double-r">
                <ul className="small-list">
                    {props.eventPlayerList?.map(a => 
                        <li>
                            <div>{a.username}</div>
                            <div></div>
                        </li>
                    )}
                </ul>
            </div>
            <div className="panel">
                <ul className="large-list clickable-list">
                    {props.eventData?.games?.map((game, i) => 
                        <li onClick={() => selectGame(i)} className={getSelectedGameIndex()===i?"selected":""}>
                            <div>{game.title}</div>
                            <div className="double-r rigth-element"></div>
                            <div>{game.description}</div>
                        </li>
                    )}
                </ul>
            </div>
            <div className="buttom-right-button">
                <MainButton 
                    text={"Start"}
                    className={getSelectedGameIndex()===-1?"locked":""}
                    onClick={startGame}
                />
            </div>
        </div>
    );
}

export default LobbyModScreen 