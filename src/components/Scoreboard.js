import trophyIcon from "../assets/trophy.svg"
import coinsIcon from "../assets/coins.svg"
import roundIcon from "../assets/round.svg"
import upIcon from "../assets/up.svg"
import downIcon from "../assets/down.svg"
import { getPlayerState } from "../tools/tools"

const Scoreboard = props => {

    const renderPlayerItem = a => {
        let m = getPlayerState() === props.PlayerStates.MOD;
        let global = props.eventStatus?.globalScores?.[a.playerId] ?? '-';
        let coins = props.gameStatus?.find(b => b.current)?.playerProgress[a.playerId]?.score;
        return (
            <li className="scoreboard-item-player">
                <div>{a.username}</div>
                <div className="scoreboard-score-data">
                    {m?
                        <button className="score-up">
                            <img src={upIcon}></img>
                        </button>
                    :''}
                    <p>{global}</p>
                    <img className="scoreboard-score-data" src={trophyIcon}></img>
                    {m?
                        <button className="score-down">
                            <img src={downIcon}></img>
                        </button>
                    :''}
                </div>
                {coins?
                    <div className="scoreboard-score-data">
                        {m?
                            <button className="score-up">
                                <img src={upIcon}></img>
                            </button>
                        :''}
                        <p>coins</p>
                        <img className="scoreboard-score-data" src={coinsIcon}></img>
                        {m?
                            <button className="score-down">
                                <img src={downIcon}></img>
                            </button>
                        :''}
                    </div>
                :''}
                <div className="scoreboard-score-data">
                    <p>5</p>
                    <img className="scoreboard-score-data" src={roundIcon}></img>
                </div>
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