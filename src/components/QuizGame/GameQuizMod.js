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

    const renderSelectScreen = () => {
        return (
            <div className="lobby-mod-grid">
                <div className="game-title">
                    <h1>
                        {props.eventData?.title}
                    </h1>
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
                            <li onClick={() => selectQuestion(i)} className={i===selectedQuestion?"selected":""}>
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
                        {props.eventData?.title}
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
                />
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