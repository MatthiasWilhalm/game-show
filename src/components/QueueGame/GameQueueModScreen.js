import BuzzerTriggerEventComponent from "./BuzzerTriggerEventComponent";
import MainButton from "../MainButton";
import ResultWindow from "../ResultWindow";
import { useRef, useState } from "react";

const GameQueueModScreen = props => {

    const game = props.eventData?.games[props.eventStatus?.gameStatus?.findIndex(g => g.current)];
    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);

    const updateStatus = () => {
        props.send('seteventstatus', props.eventStatus);
    }

    const setupRoundStatus = roundId => {
        let ngs = gameState.roundStatus;
        let oldRound = ngs?.find(a => a.roundId === roundId);
        if(!oldRound) {
            ngs.push({roundId: roundId, hints: [], current: true, clickedBuzzer: null, paused: false});
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

    const isPaused = () => {
        return gameState.roundStatus.find(i => i.roundId === getCurrentRoundId()).paused;
    }

    const buzzerEventRight = () => {
        let ngs = gameState?.playerProgress[getBuzzerClickedPlayer().playerId];
        if(ngs) {
            if(ngs.score)
                ngs.score = parseInt(ngs.score) + parseInt(game.content.scoreWin);
            else
                ngs.score = parseInt(game.content.scoreWin);
            triggerRoundWindow(ngs.score);
            resetBuzzerEvent();
            closeRound();
            updateStatus();
        }
    }

    const triggerRoundWindow = score => {
        props.send('triggerresultscreen', {username: getBuzzerClickedPlayer().username, score, change: game.content.scoreWin, msg: ""});
    }

    const triggerGameEndWindow = (winnerUsername, score, change) => {
        props.send('triggerresultscreen', {username: winnerUsername, score: score, change: change, title: "winner of this game", msg: ""});
    }

    const buzzerEventWrong = () => {
        let ngs = gameState?.playerProgress[getBuzzerClickedPlayer().playerId];
        if(ngs) {
            if(ngs.score)
                ngs.score = parseInt(ngs.score) + parseInt(game.content.scoreLose);
            else
                ngs.score = parseInt(game.content.scoreLose);
        }
        updateStatus();
        resetBuzzerEvent();
    }

    const resetBuzzerEvent = () => {
        let ngs = gameState.roundStatus;
        let e = ngs.find(i => i.roundId === getCurrentRoundId());
        e.paused = false;
        e.clickedBuzzer = null;
        updateStatus();
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
        if(player instanceof Array && player.length)
            return player.map(a => a.username).join(", ");
        return " ";
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
        const winnerScores = [];
        winner.forEach(w => {
            const { globalScores } = props.eventStatus;
            globalScores[w] = parseInt(globalScores[w]) + 1 ?? 1;
            winnerScores.push(globalScores[w]);
        });
        triggerGameEndWindow(
            generatePlayerArrayToString(props.eventPlayerList.filter(a => winner.includes(a.playerId))),
            winnerScores.join("; "),
            1
        );
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
                    <div className="mod-menu-button" onClick={closeGame}>Lobby</div>
                </div>
                <div></div>
                <div className="panel clickable-list">
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
                <div className="mod-menu-button-array">
                    <div className="mod-menu-button" onClick={closeRound}>Rounds</div>
                </div>
                <div></div>
                <div className="panel clickable-list">
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
                {!!getBuzzerClickedPlayer()?
                    <BuzzerTriggerEventComponent username={getBuzzerClickedPlayer()?.username}/>
                :
                    ''
                }
                {!!getBuzzerClickedPlayer()?
                    <div className="buttom-right-button">
                        <label>{getBuzzerClickedPlayer()?.username+" speaks"}</label>
                        <MainButton text={"right"} className="right" onClick={buzzerEventRight}></MainButton>
                        <MainButton text={"skip"} onClick={resetBuzzerEvent}></MainButton>
                        <MainButton text={"wrong"} className="wrong" onClick={buzzerEventWrong}></MainButton>
                    </div>
                :
                    ''
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

export default GameQueueModScreen