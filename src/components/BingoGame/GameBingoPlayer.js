import TeamCreateWindow from "../TeamCreateWindow";
import BingoBoard from "./BingoBoard";

const GameBingoPlayer = props => {

    
    const game = props.eventData?.games[props.eventStatus?.gameStatus?.findIndex(g => g.current)];
    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);


    const updateStatus = s => {
        props.send('seteventstatus', s || props.eventStatus);
    }

    const showTeamScreen = () => {
        return !gameState.teamsCreated;
    }

    const getPlayerlist = () => {
        let pl = JSON.parse(JSON.stringify(props.eventPlayerList?.filter(a => a.playerState === props.PlayerStates.PLAYER)));
        pl.map(a => {
            a.team = gameState?.playerProgress?.[a.playerId]?.team;
            return a;
        });
        return pl;
    }

    const isInRound = () => {
        return !!gameState.roundStatus.find(a => a.current);
    }

    const renderSelect = () => {
        return (
            <div className="lobby-mod-grid">
                <div className="game-title">
                    <h1>
                        {game?.title}
                    </h1>
                </div>
                <div></div>
                <BingoBoard isMod={false} game={game} gameState={gameState}></BingoBoard>
            </div>
        );
    }

    const renderRound = () => {
        return (
            <div></div>
        );
    }

    return (
        <div>
            {showTeamScreen()?
                <TeamCreateWindow 
                    eventPlayerList={getPlayerlist()}
                    isMod={false}
                    callback={() => null}
                />
            :
                ''
            }
            {isInRound()?
                renderRound()
            :
                renderSelect()
            }
        </div>
    );
}

export default GameBingoPlayer