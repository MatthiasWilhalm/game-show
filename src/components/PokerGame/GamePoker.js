import { useEffect, useState } from "react";
import { getPlayerId } from "../../tools/tools";

const GamePoker = props => {

    
    const game = props.eventData?.games[props.eventStatus?.gameStatus?.findIndex(g => g.current)];
    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);
    
    const [guess, setGuess] = useState(gameState.playerProgress[getPlayerId()]?.selection || "");

    useEffect(() => {
        if(!isConclusion()) {
            console.log(gameState.playerProgress[getPlayerId()]?.selection);
            setGuess(gameState.playerProgress[getPlayerId()]?.selection || "");
        }
    }, [props.eventStatus])
    
    
    const updateStatus = () => {
        props.send('seteventstatus', props.eventStatus);
    }

    const isConclusion = () => {
        return !!getCurrentRoundData()?.conclude;
    }


    const getCurrentRoundId = () => {
        return gameState.roundStatus.find(a => a.current)?.roundId;
    }

    const getCurrentRound = () => {
        return game.content.rounds[getCurrentRoundId()];
    }

    const getCurrentRoundData = () => {
        return gameState.roundStatus.find(a => a.current);
    }

    const getActiveHints = () => {
        let ret = [];
        getCurrentRound()?.hints.forEach((hint, i) => {
            if(gameState.roundStatus.find(a => a.current).hints.includes(i))
                ret.push(hint);
        });
        return ret;
    }

    const confirmGuess = () => {
        let currentPlayerProgess = gameState.playerProgress[getPlayerId()];
        if(!currentPlayerProgess)
            return;
        currentPlayerProgess.selection = guess;
        updateStatus();
    }

    const isPaused = () => {
        return !!gameState.roundStatus.find(i => i.roundId === getCurrentRoundId())?.paused;
    }

    const showBuzzer = () => {
        return gameState.roundStatus.find(i => i.roundId === getCurrentRoundId())!==undefined && !isPaused();
    }

    const getBuzzerClickedUsername = () => {
        let userClicked = gameState?.roundStatus?.find(i => i.roundId === getCurrentRoundId())?.clickedBuzzer;
        return props?.eventPlayerList?.find(a => a.playerId === userClicked)?.username || null;
    }

    const isSpectator = () => {
        return props.eventPlayerList?.find(a => a.playerId === getPlayerId())?.playerState === props.PlayerStates.SPECTATOR;
    }

    const getRoundWinner = () => {
        //TODO
    }

    const renderMediaContent = (url, type, className) => {
        switch (type) {
            case "image":
                return (
                    <img src={url} className={className || ""}></img>
                );            
            case "video":
                return (
                    <video src={url} className={className || ""}></video>
                );
            case "audio":
                return (
                    <audio src={url} className={className || ""}></audio>
                );
            case "iframe":
                return (
                    <iframe src={url} className={className || ""}></iframe>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {/* <ResultWindow
                username={roundWinner?.username}
                score={roundWinner?.score}
                change={roundWinner?.change}
                msg={roundWinner?.msg}
                autoHide={true}
                ref={refResult}
            /> */}
            <div className="lobby-mod-grid">
                <div className="game-title">
                    <h1>
                        {game.title}
                    </h1>
                </div>
                <div></div>
                <div className="panel centered-panel">
                    <ul className="large-list">
                        {getActiveHints().map(a => 
                            <li className="no-grid">
                                <div className="list-content">
                                    {a.text}
                                    {renderMediaContent(a.url, a.urlType, "")}
                                </div>
                            </li>    
                        )}
                    </ul>
                </div>
                {!isConclusion() ?
                    <div className="poker-input">
                        <input 
                            type="text"
                            value={guess}
                            onChange={e => setGuess(e.target.value)}
                        ></input>
                        <button
                            onClick={confirmGuess}
                        >
                            Confirm
                        </button>
                    </div>
                :
                    <div className="sidepanel panel">
                        <ul className="small-list">
                            {props.eventPlayerList?.filter(a => a.playerState === props.PlayerStates.PLAYER).map(a => 
                                <li>
                                    <div className="poker-user-list-item">
                                        <h4>
                                            {a.username}
                                        </h4>
                                        {gameState.playerProgress[a.playerId]?.visible ? 
                                            gameState.playerProgress[a.playerId]?.selection ?? ""
                                        :""}
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                }
            </div>
        </div>
    );
}

export default GamePoker