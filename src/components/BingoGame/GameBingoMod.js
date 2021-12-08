import TeamCreateWindow from "../TeamCreateWindow";

const GameBingoMod = props => {

    const game = props.eventData?.games[props.eventStatus?.gameStatus?.findIndex(g => g.current)];
    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);

    const updateStatus = s => {
        props.send('seteventstatus', s || props.eventStatus);
    }

    const showTeamScreen = () => {
        return !gameState.teamsCreated;
    }

    const teamWindowCallback = data => {
        if(data instanceof Array) {
            data.forEach(a => {
                if(gameState?.playerProgress?.[a.playerId]?.team!==undefined) {
                    gameState.playerProgress[a.playerId].team = a.team;
                    // delete a.team;
                }
            });
            updateStatus();
        }
    }

    const teamWindowConfirmCallback = () => {
        props.send('updateteams', getPlayerlist());
        gameState.teamsCreated = true;
        updateStatus();
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
                    isMod={true}
                    callback={teamWindowCallback}
                    confirmCallback={teamWindowConfirmCallback}
                />
            :
                ''
            }
        </div>
    );
}

export default GameBingoMod