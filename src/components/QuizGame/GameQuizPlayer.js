import { getPlayerId } from "../../tools/tools";
import QuestionComponent from "../QuestionComponent";
import Scoreboard from "../Scoreboard";

const GameQuizPlayer = props => {
    const game = props.eventData?.games[props.eventStatus?.gameStatus?.findIndex(g => g.current)];
    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);

    const isInRound = () => {
        return !!gameState.roundStatus.find(a => a.current);
    }

    const getCurrentQuestion = () => {
        let g = gameState.roundStatus.find(a => a.current);
        if(g) {
            return game.content.questions[g.roundId] || null;
        }
        return null;
    }

    const isAskedPlayer = () => {
        let g = gameState.roundStatus.find(a => a.current);
        return g && g.currentPlayerId === getPlayerId();
    }

    const renderWaitingScreen = () => {
        return (
            <div className="lobby-grid">
                <div className="game-title">
                    <h1>
                        {props.eventData?.title}
                    </h1>
                </div>
                <div className="scoreboard-embedded">
                    <Scoreboard {...props}></Scoreboard>
                </div>
            </div>
        );
    }

    const renderQuestionScreen = () => {
        return (
            <div className="lobby-grid">
                <div className="game-title">
                    <h1>
                        {props.eventData?.title}
                    </h1>
                </div>
                <div className="question-container">
                    <QuestionComponent question={getCurrentQuestion()} asking={isAskedPlayer()}/>
                    {!isAskedPlayer()?
                        <div className="true-false-buttons">
                            <button className="right">true</button>
                            <button className="wrong">false</button>
                        </div>
                    :''}
                </div>                
            </div>
        );
    }

    return (
        <div>
            {isInRound()?
                renderQuestionScreen()
            :
                renderWaitingScreen()
            }
        </div>
    );
}

export default GameQuizPlayer