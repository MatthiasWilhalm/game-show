import { useState } from "react";
import MainButton from "../MainButton";
import TeamCreateWindow from "../TeamCreateWindow";
import BingoBoard from "./BingoBoard";

const GameBingoMod = props => {

    const game = props.eventData?.games[props.eventStatus?.gameStatus?.findIndex(g => g.current)];
    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);

    const TeamNames = ["Team A", "Team B"];
    const TeamClasses = ["team-a", "team-b"];

    const [selectedTeam, setSelectedTeam] = useState(-1);
    const [selectedRound, setSelectedRound] = useState(-1);

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

    const getAvailableTeams = () => {
        let t = [];
        getPlayerlist().forEach(a => a.team!==undefined && a.team !==-1 ? t.push(a.team) : null);
        return [... new Set(t)];
    }

    const startRound = () => {
        if(isReady()) {
            let ngs = gameState.roundStatus;
            let oldRound = ngs?.find(a => a.roundId === selectedRound);
            if(!oldRound) {
                ngs.push({
                    roundId: selectedRound,
                    currentTeam: selectedTeam,
                    current: true,
                    teamsAnswer: null
                });
            } else {
                oldRound.current = true;
            }
            updateStatus();
        }
    }

    const selectTeam = teamId => {
        if(selectedTeam === teamId) {
            setSelectedTeam(-1);
        } else{
            setSelectedTeam(teamId);
        }
    }

    const selectRound = roundIndex => {
        console.log(roundIndex);
        if(roundIndex === selectedRound) {
            setSelectedRound(-1);
        } else {
            setSelectedRound(roundIndex);
        }
    }

    const isReady = () => {
        return selectedRound !== -1 && selectedTeam !== -1;
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
                <div className="sidepanel panel double-r">
                    <ul className="small-list clickable-list">
                        {getAvailableTeams().map(a => 
                            <li onClick={() => selectTeam(a)} className={(a===selectedTeam?"selected ":TeamClasses[a])}>
                                <div>{TeamNames[a]}</div>
                                <div></div>
                            </li>
                        )}
                    </ul>
                </div>
                <BingoBoard 
                    isMod={true}
                    game={game}
                    gameState={gameState}
                    categoryCallback={selectRound}
                    selected={selectedRound}
                ></BingoBoard>
                <div></div>
                <div className="buttom-right-button">
                    <MainButton className={(!isReady())?"locked":""} text="Start" onClick={isReady()?startRound:null}></MainButton>
                </div>
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
                    isMod={true}
                    callback={teamWindowCallback}
                    confirmCallback={teamWindowConfirmCallback}
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

export default GameBingoMod