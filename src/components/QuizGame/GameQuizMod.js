import { useState } from "react";
import MainButton from "../MainButton";
import QuestionComponent from "../QuestionComponent";

const GameQuizMod = props => {
    const game = props.eventData?.games[props.eventStatus?.gameStatus?.findIndex(g => g.current)];
    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);

    const updateStatus = () => {
        props.send('seteventstatus', props.eventStatus);
    }


    const [selectedQuestion, setSelectedQuestion] = useState(-1);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const selectQuestion = i => {
        if(i===selectedQuestion)
            setSelectedQuestion(-1);
        else
            setSelectedQuestion(i);
    }

    const selectPlayer = playerId => {
        if(playerId === selectedPlayer)
            setSelectedPlayer(null);
        else
            setSelectedPlayer(playerId);
    }

    const isReady = () => {
        return selectedPlayer && selectedQuestion!==-1;
    }

    const startRound = () => {
        if(isReady()) {
            let ngs = gameState.roundStatus;
            let oldRound = ngs?.find(a => a.roundId === selectedQuestion);
            if(!oldRound) {
                ngs.push({
                    roundId: selectedQuestion,
                    currentPlayerId: selectedPlayer,
                    current: true,
                    playersAnswer: null
                });
            } else {
                oldRound.current = true;
            }
            updateStatus();
        }
    }

    const isInRound = () => {
        return !!gameState.roundStatus.find(a => a.current);
    }

    const getCurrentQuestion = () => {
        return game.content.questions[selectedQuestion] || null;
    }

    const getEstimateValue = playerId => {
        return gameState?.playerProgress?.[playerId]?.selection ?? -1;
    }
    
    const getAskedPlayer = () => {
        let g = gameState.roundStatus.find(a => a.current);
        if(g) {
            return props.eventPlayerList.find(a => a.playerId === g.currentPlayerId) || null;
        }
        return null;
    }

    const getQuestionSelection = () => {
        return gameState.playerProgress?.[gameState.roundStatus?.find(a => a.current)?.currentPlayerId]?.selection;
    }
    
    const setAnswerForAskedPlayer = value => {
        let ng = gameState.playerProgress[getAskedPlayer().playerId];
        if(ng) {
            ng.selection = value;
            console.log(ng.selection);
            updateStatus();
        }
    }

    const isAlreadyAskedQuestion = i => {
        return !!gameState.roundStatus.find(a => a.roundId === i);
    }

    const clearSelectionfromAllPlayers = () => {
        if(gameState.playerProgress) {
            Object.keys(gameState.playerProgress).forEach(a => {
                gameState.playerProgress[a].selection = -1;
            });
        }
        updateStatus();
    }

    const triggerCloseRound = () => {
        // let s = props.eventStatus.globalScores[getAskedPlayer().playerId];
        let s = gameState.playerProgress?.[getAskedPlayer().playerId];
        let c = 0;
        let correct = getCurrentQuestion()?.presetAnswers[getQuestionSelection()]?.correct;
        if(correct) {
            c = game.content.scoreWin;
        } else {
            c = game.content.scoreLose;
        }
        if(s.score===undefined) {
            s.score = c;
        } else {
            s.score += c;
        }
        updateSpecStatus(correct);
        triggerRoundWindow(s.score, c);
        closeRound();
        clearSelectionfromAllPlayers();
    }

    const triggerRoundWindow = (score, change) => {
        props.send('triggerresultscreen', {username: getAskedPlayer()?.username, score: score, change: change, msg: getCorrectAnswerAsString()});
    }

    const triggerGameEndWindow = (winnerUsername, score, change) => {
        props.send('triggerresultscreen', {username: winnerUsername, score: score, change: change, title: "winner of this game", msg: ""});
    }

    const getCorrectAnswerAsString = () => {
        let ret = "";
        getCurrentQuestion().presetAnswers.filter(a => a.correct).forEach(a => {
            ret+=a.text+"; ";
        });
        return ret;
    }

    const updateSpecStatus = answerWasCorret => {
        Object.keys(gameState.playerProgress).filter(a => a !== getAskedPlayer()?.playerId).forEach(a => {
            let b = gameState.playerProgress[a];
            if((answerWasCorret && b.selection===1) || (!answerWasCorret && b.selection===0)) {
                if(b.score!==undefined)
                    b.score += game.content.scoreSpecWin;
                else 
                    b.score = game.content.scoreSpecWin;
            } else {
                if(b.score!==undefined)
                    b.score += game.content.scoreSpecLose;
                else 
                    b.score = game.content.scoreSpecLose;
            }
        });
        updateStatus();
    }

    const closeRound = () => {
        let ngs = gameState.roundStatus;
        let e = ngs.find(i => i.roundId === selectedQuestion);
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
                gs[w] += 1;
            } else {
                gs[w] = 1;
            }
            displayScore += gs[w]+"; ";
        });
        triggerGameEndWindow(generatePlayerArrayToString(props.eventPlayerList.filter(a => winner.includes(a.playerId))), displayScore, 1);
        updateStatus();
    }

    const renderSelectScreen = () => {
        return (
            <div className="lobby-mod-grid">
                <div className="mod-title">
                    <div className="game-title">
                        <h1>
                            {game?.title}
                        </h1>
                    </div>
                    <div className="mod-menu-button-array-2">
                        <div className="mod-menu-button" onClick={closeGame}>Lobby</div>
                    </div>
                </div>
                    <div className="sidepanel panel double-r">
                        <ul className="small-list clickable-list">
                            {props.eventPlayerList?.filter(b => b.playerState === props.PlayerStates.PLAYER).map(a => 
                                <li onClick={() => selectPlayer(a.playerId)} className={a.playerId===selectedPlayer?"selected":""}>
                                    <div>{a.username}</div>
                                    <div></div>
                                </li>
                            )}
                        </ul>
                    </div>
                <div className="panel">
                    <ul className="large-list clickable-list">
                        {game.content.questions.map((a,i) =>
                            <li 
                                onClick={() => selectQuestion(i)}
                                className={(i===selectedQuestion?"selected ":"")+(isAlreadyAskedQuestion(i)?"locked":"")}>
                                <div>{a.question}</div>
                                <div></div>
                                <div></div>
                            </li>    
                        )}
                    </ul>
                </div>
                <div className="buttom-right-button">
                    <MainButton 
                        text={"Start"}
                        className={isReady()?"":"locked"}
                        onClick={startRound}
                    />
                </div>
            </div>
        );
    }

    const renderQuestionScreen = () => {
        return (
            <div className="lobby-mod-grid">
                <div className="game-title">
                    <h1>
                        {game?.title}
                    </h1>
                </div>
                <div className="sidepanel panel double-r">
                    <ul className="small-list">
                        {props.eventPlayerList?.filter(b => (b.playerState === props.PlayerStates.PLAYER && b.playerId !== getAskedPlayer()?.playerId)).map(a => 
                            <li className={getEstimateValue(a.playerId)===0?'wrong':(getEstimateValue(a.playerId)===1?'right':'')}>
                                <div>{a.username}</div>
                                <div></div>
                            </li>
                        )}
                    </ul>
                </div>
                <QuestionComponent 
                    question={getCurrentQuestion()}
                    selection={getQuestionSelection()}
                    callback={setAnswerForAskedPlayer}
                />
                
                <div className="buttom-right-button">
                    <MainButton 
                        text={"show result"}
                        className={getQuestionSelection()===-1?'locked':''}
                        onClick={() => getQuestionSelection()===-1?null:triggerCloseRound()}
                    ></MainButton>
                </div>
            </div>
        );
    }

    return (
        <div>
            {isInRound()?
                renderQuestionScreen()
            :
                renderSelectScreen()    
            }
        </div>
    );
}

export default GameQuizMod