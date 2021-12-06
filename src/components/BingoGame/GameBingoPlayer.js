import TeamCreateWindow from "../TeamCreateWindow";

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
        </div>
    );
}

export default GameBingoPlayer