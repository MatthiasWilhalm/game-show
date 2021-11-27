import { getPlayerId, getPlayerState, storePlayerState } from "../tools/tools";
import MainButton from "./MainButton";

const LobbyPlayerScreen = props => {

    const getSelectedGameIndex = () => {
        return props.eventStatus?.gameStatus?.findIndex(g => g.selected);
    }

    const getSelectedGame = () => {
        let id = getSelectedGameIndex();
        if(id!==-1) {
            return props.eventData?.games[id];
        }
        return null;
    }

    const changeToSpectator = () => {
        props.send('updateplayerdata', {oldPlayerId: getPlayerId(), playerState: props.PlayerStates.SPECTATOR});
        storePlayerState(props.PlayerStates.SPECTATOR);
    }


    return (
        <div className="lobby-grid">
            <div></div>
            <div className="lobby-screen">
                <h1>{props.eventData?.title}</h1>
                <h2>{getSelectedGame()?.title ?? "Game starts soon..."}</h2>
                <h3>Mod: Hugo</h3>
                <p>{props.eventPlayerList?.length+" online"}</p>
            </div>
            <div className="buttom-right-button">
                {(getPlayerState() === props.PlayerStates.PLAYER+'')?
                    <MainButton text={"switch to spectator"} onClick={changeToSpectator}></MainButton>
                :
                    <MainButton text={"request to play"}></MainButton>
                }
            </div>
        </div>
    );
}

export default LobbyPlayerScreen