import MainButton from "../MainButton";

import eyeOpenIcon from "../../assets/eye_open.svg";
import eyeClosedIcon from "../../assets/eye_closed.svg";


const GamePokerMod = (props) => {

    const game = props.eventData?.games[props.eventStatus?.gameStatus?.findIndex(g => g.current)];
    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);

    const updateStatus = () => {
        props.send('seteventstatus', props.eventStatus);
    }

    const setupRoundStatus = roundId => {
        let ngs = gameState.roundStatus;
        let oldRound = ngs?.find(a => a.roundId === roundId);
        if(!oldRound) {
            ngs.push({roundId: roundId, hints: [], current: true, conclude: false});
            updateStatus();
        } else{
            oldRound.current = true;
            updateStatus();
        }
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

    const getCurrentRoundData = () => {
        return gameState.roundStatus.find(a => a.current);
    }

    const openHint = hintId => {
        let ngs = gameState.roundStatus;
        if(!isHintLocked(hintId)) {
            ngs.find(i => i.roundId === getCurrentRoundId()).hints.push(hintId);
            updateStatus();
        }
    }

    const isHintLocked = hintId => {
        return gameState.roundStatus.find(a => a.current)?.hints.includes(hintId);
    }

    const getBuzzerClickedPlayer = () => {
        let userClicked = gameState?.roundStatus?.find(i => i.roundId === getCurrentRoundId())?.clickedBuzzer;
        return props?.eventPlayerList?.find(a => a.playerId === userClicked) || null;
    }

    const triggerRoundWindow = score => {
        props.send('triggerresultscreen', {username: getNearestPlayerName, score, change: game.content.scoreWin, msg: ""});
    }

    const triggerGameEndWindow = (winnerUsername, score, change) => {
        props.send('triggerresultscreen', {username: winnerUsername, score: score, change: change, title: "winner of this game", msg: ""});
    }

    const resetRound = () => {
        Object.keys(gameState.playerProgress).forEach(ps => {
            if(gameState.playerProgress?.[ps]) {
                gameState.playerProgress[ps].visible = false;
                gameState.playerProgress[ps].nearest = false;
                gameState.playerProgress[ps].selection = "";
            }
        });
        updateStatus();
    }

    const setConclutionState = (newState) => {
        let ngs = gameState.roundStatus;
        let e = ngs.find(i => i.roundId === getCurrentRoundId());
        e.conclude = newState;
        updateStatus();
    }

    const revealRoundsWinner = () => {
        let displayScore = "";
        getNearestPlayer().forEach(ps => {
            const playerProgess = gameState?.playerProgress[ps];
            if(!playerProgess) return;
            playerProgess.score = parseInt(playerProgess.score) + parseInt(game.content.scoreWin);
            displayScore += playerProgess.score+" ";
        });
        triggerRoundWindow(displayScore);
        resetRound();
        closeRound();
        updateStatus();
    }

    const togglePlayersGuess = playerId => {
        const playerProgress = gameState.playerProgress[playerId];
        if(!playerProgress) return;
        playerProgress.visible = !playerProgress.visible;
        updateStatus();
    }

    const showAllPlayersGuess = () => {
        Object.keys(gameState.playerProgress).forEach(ps => {
            gameState.playerProgress[ps].visible = true;
        });
        updateStatus();
    }

    const togglePlayerIsNearest = playerId => {
        const playerProgress = gameState.playerProgress[playerId];
        if(!playerProgress) return;
        playerProgress.nearest = !playerProgress.nearest;
        updateStatus();
    }

    const isPlayerNearest = playerId => {
        const playerProgress = gameState.playerProgress[playerId];
        if(!playerProgress) return false;
        return playerProgress.nearest;
    }

    const getNearestPlayer = () => {
        let nearest = [];
        Object.keys(gameState.playerProgress).forEach(ps => {
            if(gameState.playerProgress[ps].nearest)
                nearest.push(ps);
        });
        return nearest;
    }

    const getNearestPlayerName = () => {
        let nearest = getNearestPlayer();
        let ret = "";
        if(nearest.length) {
            nearest.forEach((a, i) => {
                ret += gameState.playerProgress[a].username;
                if(i<nearest.length-1)
                    ret += ", ";
            });
        }
        return ret;
    }

    const getFisrtNumberOutOfText = text => {
        const match = text.match(/\d+/);
        if(match)
            return match[0];
        return null;
    }

    const autoCalculateNearestGuess = () => {
        let nearest = [];
        let nearestDiff = Number.MAX_SAFE_INTEGER;
        Object.keys(gameState.playerProgress).forEach(ps => {
            const playerProgess = gameState.playerProgress[ps];
            if(!playerProgess) return;
            const guessAsNumber = getFisrtNumberOutOfText(playerProgess.selection);
            if(guessAsNumber === null) return;
            const diff =  Math.abs(guessAsNumber - getAwnserAsNumber());
            if(diff < nearestDiff) {
                nearestDiff = diff;
                nearest = [ps];
            } else if(diff === nearestDiff) {
                nearest.push(ps);
            }
        });
        if(nearest.length) {
            nearest.forEach(ps => {
                gameState.playerProgress[ps].nearest = true;
            });
            updateStatus();
        }
    }

    const getAwnserAsNumber = () => {
        return getFisrtNumberOutOfText(getCurrentRound()?.answer);
    }

    const closeRound = () => {
        let ngs = gameState.roundStatus;
        let e = ngs.find(i => i.roundId === getCurrentRoundId());
        e.current = false;
        updateStatus();
    }

    const closeGame = () => {
        setWinner();
        gameState.current = false;
        gameState.done = true;
        updateStatus();
    }

    const generatePlayerArrayToString = player => {
        let ret = "";
        if(player instanceof Array && player.length) {
            player.forEach((a, i) => {
                ret += a.username;
                if(i<player.length-1)
                    ret += ", ";
            });
        }
        return ret;
    }

    const setWinner = () => {
        let winner = [];
        let maxScore = Number.MIN_SAFE_INTEGER;
        Object.keys(gameState.playerProgress).forEach(ps => {
            if(gameState.playerProgress[ps].score>maxScore)
                maxScore = gameState.playerProgress[ps].score;
        });
        Object.keys(gameState.playerProgress).forEach(ps => {
            if(gameState.playerProgress[ps].score===maxScore)
                winner.push(ps);
        });
        let gs = props.eventStatus.globalScores;
        let displayScore = "";
        winner.forEach(w => {
            if(gs[w]) {
                gs[w] = parseInt(gs[w]) + 1;
            } else {
                gs[w] = parseInt(gs[w]) + 1;
            }
            displayScore += gs[w]+"; ";
        });
        triggerGameEndWindow(generatePlayerArrayToString(props.eventPlayerList.filter(a => winner.includes(a.playerId))), displayScore, 1);
        updateStatus();
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

    const renderRoundSelectScreen = () => {
        return (
            <div className="lobby-mod-grid">
                <div className="game-title">
                    <h1>
                        {game.title}
                    </h1>
                </div>
                <div className="mod-menu-button-array">
                    <div 
                        className="mod-menu-button"
                        onClick={closeGame}
                    >
                        Lobby
                    </div>
                    {getCurrentRoundData()?.conclude && 
                        <div 
                            className="mod-menu-button"
                            onClick={() => setConclutionState(false)}
                        >
                            back to guess
                        </div>
                    }
                </div>
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
                        {getCurrentRound()?.answer}
                    </h1>
                </div>
                <div>
                    <div className="mod-menu-button" onClick={closeRound}>Rounds</div>
                </div>
                <div className="panel centered-panel clickable-list">
                    <ul className="large-list">
                        {getCurrentRound()?.hints?.map((a, i) => 
                            <li 
                                onClick={() => openHint(i)}
                                className={`no-grid ${isHintLocked(i)?"locked":""}`}
                            >
                                <div className="list-content">
                                    {a.text}
                                    {renderMediaContent(a.url, a.urlType, "")}
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="sidepanel panel">
                    <ul className="small-list">
                        {props.eventPlayerList?.filter(a => a.playerState === props.PlayerStates.PLAYER).map(a => 
                            <li 
                                className={isPlayerNearest(a.playerId) ? 'selected' : ''}
                                key={a.playerId}
                            >
                                <div className="poker-user-list-item">
                                    <h4
                                        onClick={() => togglePlayerIsNearest(a.playerId)}
                                    >
                                        {a.username}
                                    </h4>
                                    {gameState.playerProgress[a.playerId]?.selection ?? ""}
                                </div>
                                {getCurrentRoundData()?.conclude &&
                                    <div onClick={() => togglePlayersGuess(a.playerId)}>
                                        <img 
                                            src={gameState.playerProgress[a.playerId]?.visible ? eyeOpenIcon : eyeClosedIcon}
                                        ></img>
                                    </div>
                                }
                            </li>
                        )}
                    </ul>
                </div>
                <div></div>
                    {!getCurrentRoundData()?.conclude ? 
                        <div className="buttom-right-button">
                            <MainButton 
                                text={"Conclude"}
                                onClick={() => setConclutionState(true)}
                            ></MainButton>
                        </div>
                    :
                        <div className="buttom-right-button">
                            <MainButton
                                text={"Auto calc nearest"}
                                onClick={autoCalculateNearestGuess}
                                locked={getAwnserAsNumber() === null}
                            ></MainButton>
                            <MainButton
                                text={"Reveal all"}
                                onClick={showAllPlayersGuess}
                            ></MainButton>
                            <MainButton
                                text={"Show winner"}
                                onClick={revealRoundsWinner}
                                locked={!getNearestPlayer()?.length}
                            ></MainButton>
                        </div>
                    }
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

export default GamePokerMod;