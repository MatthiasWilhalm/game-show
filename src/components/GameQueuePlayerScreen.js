import { getPlayerId } from "../tools/tools";
import BuzzerTriggerEventComponent from "./BuzzerTriggerEventComponent";
import MainButton from "./MainButton";

const GameQueuePlayerScreen = props => {

    const game = props.eventData?.games[props.eventStatus?.gameStatus?.findIndex(g => g.current)];
    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);


    const getCurrentRoundId = () => {
        return gameState.roundStatus.find(a => a.current)?.roundId;
    }

    const getCurrentRound = () => {
        return game.content.rounds[getCurrentRoundId()];
    }

    const getActiveHints = () => {
        let ret = [];
        getCurrentRound()?.hints.forEach((hint, i) => {
            if(gameState.roundStatus.find(a => a.current).hints.includes(i))
                ret.push(hint);
        });
        return ret;
    }

    const buzzer = () => {
        let ngs = gameState.roundStatus;
        let r = ngs.find(i => i.roundId === getCurrentRoundId());
        r.paused = true;
        r.clickedBuzzer = getPlayerId();
        let ret = props.eventStatus;
        ret.gameStatus.find(g => g.current).roundStatus = ngs;
        props.send('seteventstatus', ret);
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

    return (
        <div className="lobby-mod-grid">
            <div className="game-title">
                <h1>
                    {game.title}
                </h1>
            </div>
            <div></div>
            <div className="double panel centered-panel">
                <ul className="large-list">
                    {getActiveHints().map(a => 
                        <li>
                            <div>{a.text}</div>
                            <div></div>
                            <div></div>
                        </li>    
                    )}
                </ul>
            </div>
            <div></div>
            {showBuzzer()?
                <div className="buzzer" onClick={buzzer}>
                    <h3>Buzzer</h3>
                    <p>(space)</p>
                </div>
            :
                ''
            }
            {getBuzzerClickedUsername()?
                <BuzzerTriggerEventComponent username={getBuzzerClickedUsername()}/>
            :
                ''
            }
            {getBuzzerClickedUsername()?
                <div className="buttom-right-button">
                    <MainButton className={"locked"} text={getBuzzerClickedUsername()+" speaks"}/>
                </div>
            :
                ''
            }
        </div>
    );
}

export default GameQueuePlayerScreen